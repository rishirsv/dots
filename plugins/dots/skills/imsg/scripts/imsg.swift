#!/usr/bin/env -S swift -suppress-warnings

import Contacts
import Foundation
import SQLite3

struct Options {
    var database = NSString(string: "~/Library/Messages/chat.db").expandingTildeInPath
    var participant: String?
    var search: String?
    var since: Date?
    var until: Date?
    var limit = 50
    var scanLimit = 2_000
    var attachments = false
    var resolveContacts = false
}

struct Attachment: Codable {
    let filename: String?
    let mimeType: String?
    let bytes: Int64
}

struct Message: Codable {
    let id: Int64
    let timestamp: String
    let fromMe: Bool
    let sender: String?
    let conversation: String
    let text: String?
    let attachments: [Attachment]
}

struct Result: Codable {
    let database: String
    let scanned: Int
    let returned: Int
    let contactsResolution: String
    let messages: [Message]
}

enum ImsgError: Error, CustomStringConvertible {
    case usage(String)
    case database(String)

    var description: String {
        switch self {
        case .usage(let message), .database(let message): return message
        }
    }
}

let help = """
Usage: imsg.swift [options]

Read a bounded slice of the local Messages database and print JSON.

  --participant TEXT    Match a chat name, chat identifier, or participant handle
  --search TEXT         Keep messages whose decoded text contains TEXT
  --since DATE          Include messages on/after ISO-8601 DATE
  --until DATE          Include messages before/on ISO-8601 DATE
  --limit N             Maximum returned messages (default: 50, maximum: 500)
  --scan-limit N        Maximum candidate messages decoded (default: 2000, maximum: 20000)
  --attachments         Include attachment metadata
  --resolve-contacts    Use Contacts names only if access is already authorized
  --database PATH       Override ~/Library/Messages/chat.db
  --help                Show this help

At least --participant or --search is required.
"""

func parseDate(_ value: String) throws -> Date {
    let iso = ISO8601DateFormatter()
    if let date = iso.date(from: value) { return date }
    let day = DateFormatter()
    day.locale = Locale(identifier: "en_US_POSIX")
    day.timeZone = .current
    day.dateFormat = "yyyy-MM-dd"
    if let date = day.date(from: value) { return date }
    throw ImsgError.usage("invalid date: \(value)")
}

func parseOptions() throws -> Options {
    var options = Options()
    var index = 1
    let arguments = CommandLine.arguments
    func value(after flag: String) throws -> String {
        guard index + 1 < arguments.count else { throw ImsgError.usage("missing value for \(flag)") }
        index += 1
        return arguments[index]
    }
    while index < arguments.count {
        switch arguments[index] {
        case "--participant": options.participant = try value(after: arguments[index])
        case "--search": options.search = try value(after: arguments[index])
        case "--since": options.since = try parseDate(value(after: arguments[index]))
        case "--until":
            let raw = try value(after: arguments[index])
            let parsed = try parseDate(raw)
            options.until = raw.count == 10 ? Calendar.current.date(byAdding: .day, value: 1, to: parsed) : parsed
        case "--limit": options.limit = Int(try value(after: arguments[index])) ?? 0
        case "--scan-limit": options.scanLimit = Int(try value(after: arguments[index])) ?? 0
        case "--attachments": options.attachments = true
        case "--resolve-contacts": options.resolveContacts = true
        case "--database": options.database = NSString(string: try value(after: arguments[index])).expandingTildeInPath
        case "--help": print(help); exit(0)
        default: throw ImsgError.usage("unknown option: \(arguments[index])")
        }
        index += 1
    }
    guard options.participant != nil || options.search != nil else {
        throw ImsgError.usage("at least --participant or --search is required")
    }
    guard (1...500).contains(options.limit) else { throw ImsgError.usage("--limit must be between 1 and 500") }
    guard (1...20_000).contains(options.scanLimit) else { throw ImsgError.usage("--scan-limit must be between 1 and 20000") }
    return options
}

func bind(_ statement: OpaquePointer?, _ index: Int32, _ value: String) {
    sqlite3_bind_text(statement, index, value, -1, unsafeBitCast(-1, to: sqlite3_destructor_type.self))
}

func columnText(_ statement: OpaquePointer?, _ index: Int32) -> String? {
    guard let bytes = sqlite3_column_text(statement, index) else { return nil }
    return String(cString: bytes)
}

func decodedBody(_ statement: OpaquePointer?, textColumn: Int32, bodyColumn: Int32) -> String? {
    if let text = columnText(statement, textColumn), !text.isEmpty { return text }
    let size = Int(sqlite3_column_bytes(statement, bodyColumn))
    guard size > 0, let bytes = sqlite3_column_blob(statement, bodyColumn) else { return nil }
    let data = Data(bytes: bytes, count: size)
    return (NSUnarchiver.unarchiveObject(with: data) as? NSAttributedString)?.string
}

func contactNames() -> (String, [String: String]) {
    guard CNContactStore.authorizationStatus(for: .contacts) == .authorized else {
        return ("not-authorized", [:])
    }
    let keys: [CNKeyDescriptor] = [
        CNContactFormatter.descriptorForRequiredKeys(for: .fullName),
        CNContactPhoneNumbersKey as NSString,
        CNContactEmailAddressesKey as NSString,
    ]
    let request = CNContactFetchRequest(keysToFetch: keys)
    var names: [String: String] = [:]
    do {
        try CNContactStore().enumerateContacts(with: request) { contact, _ in
            guard let name = CNContactFormatter.string(from: contact, style: .fullName), !name.isEmpty else { return }
            for phone in contact.phoneNumbers {
                let raw = phone.value.stringValue
                names[raw] = name
                names[raw.filter(\.isNumber)] = name
            }
            for email in contact.emailAddresses { names[String(email.value).lowercased()] = name }
        }
        return ("authorized", names)
    } catch {
        return ("error", [:])
    }
}

func resolved(_ handle: String?, names: [String: String]) -> String? {
    guard let handle else { return nil }
    return names[handle] ?? names[handle.lowercased()] ?? names[handle.filter(\.isNumber)] ?? handle
}

func main() throws {
    let options = try parseOptions()
    var database: OpaquePointer?
    guard sqlite3_open_v2(options.database, &database, SQLITE_OPEN_READONLY, nil) == SQLITE_OK else {
        let detail = database.map { String(cString: sqlite3_errmsg($0)) } ?? "unable to open database"
        sqlite3_close(database)
        throw ImsgError.database("cannot read Messages database: \(detail). Full Disk Access may be required.")
    }
    defer { sqlite3_close(database) }
    sqlite3_busy_timeout(database, 2_000)
    guard sqlite3_exec(database, "BEGIN", nil, nil, nil) == SQLITE_OK else {
        throw ImsgError.database("cannot start a consistent read transaction")
    }
    defer { sqlite3_exec(database, "ROLLBACK", nil, nil, nil) }

    var predicates = ["m.item_type = 0"]
    var bindings: [String] = []
    if let participant = options.participant {
        predicates.append("(COALESCE(c.display_name, '') LIKE ? COLLATE NOCASE OR COALESCE(c.chat_identifier, '') LIKE ? COLLATE NOCASE OR EXISTS (SELECT 1 FROM chat_handle_join chj JOIN handle ph ON ph.ROWID = chj.handle_id WHERE chj.chat_id = c.ROWID AND ph.id LIKE ? COLLATE NOCASE))")
        let match = "%\(participant)%"
        bindings += [match, match, match]
    }
    let appleEpoch = 978_307_200.0
    if let since = options.since {
        predicates.append("m.date >= ?")
        bindings.append(String(Int64((since.timeIntervalSince1970 - appleEpoch) * 1_000_000_000)))
    }
    if let until = options.until {
        predicates.append("m.date < ?")
        bindings.append(String(Int64((until.timeIntervalSince1970 - appleEpoch) * 1_000_000_000)))
    }
    let sql = """
        SELECT m.ROWID, m.date, m.is_from_me, h.id,
               COALESCE(NULLIF(c.display_name, ''), c.chat_identifier, c.guid),
               m.text, m.attributedBody
        FROM message m
        JOIN chat_message_join cmj ON cmj.message_id = m.ROWID
        JOIN chat c ON c.ROWID = cmj.chat_id
        LEFT JOIN handle h ON h.ROWID = m.handle_id
        WHERE \(predicates.joined(separator: " AND "))
        ORDER BY m.date DESC, m.ROWID DESC
        LIMIT ?
        """
    var statement: OpaquePointer?
    guard sqlite3_prepare_v2(database, sql, -1, &statement, nil) == SQLITE_OK else {
        throw ImsgError.database("Messages database schema is not compatible: \(String(cString: sqlite3_errmsg(database)))")
    }
    defer { sqlite3_finalize(statement) }
    for (offset, value) in bindings.enumerated() { bind(statement, Int32(offset + 1), value) }
    sqlite3_bind_int(statement, Int32(bindings.count + 1), Int32(options.scanLimit))

    let contactResult = options.resolveContacts ? contactNames() : ("not-requested", [:])
    let formatter = ISO8601DateFormatter()
    var messages: [Message] = []
    var scanned = 0
    while sqlite3_step(statement) == SQLITE_ROW {
        scanned += 1
        let text = decodedBody(statement, textColumn: 5, bodyColumn: 6)
        if let search = options.search, text?.range(of: search, options: [.caseInsensitive, .diacriticInsensitive]) == nil { continue }
        let rowID = sqlite3_column_int64(statement, 0)
        let timestamp = Double(sqlite3_column_int64(statement, 1)) / 1_000_000_000 + appleEpoch
        var attachmentList: [Attachment] = []
        if options.attachments {
            var attachmentStatement: OpaquePointer?
            let attachmentSQL = "SELECT a.filename, a.mime_type, a.total_bytes FROM attachment a JOIN message_attachment_join maj ON maj.attachment_id = a.ROWID WHERE maj.message_id = ?"
            if sqlite3_prepare_v2(database, attachmentSQL, -1, &attachmentStatement, nil) == SQLITE_OK {
                sqlite3_bind_int64(attachmentStatement, 1, rowID)
                while sqlite3_step(attachmentStatement) == SQLITE_ROW {
                    attachmentList.append(Attachment(filename: columnText(attachmentStatement, 0), mimeType: columnText(attachmentStatement, 1), bytes: sqlite3_column_int64(attachmentStatement, 2)))
                }
            }
            sqlite3_finalize(attachmentStatement)
        }
        messages.append(Message(
            id: rowID,
            timestamp: formatter.string(from: Date(timeIntervalSince1970: timestamp)),
            fromMe: sqlite3_column_int(statement, 2) != 0,
            sender: resolved(columnText(statement, 3), names: contactResult.1),
            conversation: columnText(statement, 4) ?? "unknown",
            text: text,
            attachments: attachmentList
        ))
        if messages.count == options.limit { break }
    }
    messages.reverse()
    let result = Result(database: options.database, scanned: scanned, returned: messages.count, contactsResolution: contactResult.0, messages: messages)
    let encoder = JSONEncoder()
    encoder.outputFormatting = [.prettyPrinted, .sortedKeys, .withoutEscapingSlashes]
    FileHandle.standardOutput.write(try encoder.encode(result))
    FileHandle.standardOutput.write(Data("\n".utf8))
}

do {
    try main()
} catch {
    FileHandle.standardError.write(Data("imsg: \(error)\n".utf8))
    exit(2)
}
