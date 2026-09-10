import Foundation
import Security

// Credentials travel on stdin/stdout pipes only, never argv or diagnostic output.
let args = CommandLine.arguments
if args.count != 3 || !["get", "put", "delete"].contains(args[1]) {
    fputs("usage: keychain-helper get|put|delete account\n", stderr); exit(2)
}
let query: [String: Any] = [
    kSecClass as String: kSecClassGenericPassword,
    kSecAttrService as String: "oracle-repo-mcp",
    kSecAttrAccount as String: args[2]
]
var status: OSStatus = errSecSuccess
switch args[1] {
case "get":
    var lookup = query
    lookup[kSecReturnData as String] = true
    lookup[kSecMatchLimit as String] = kSecMatchLimitOne
    var item: CFTypeRef?
    status = SecItemCopyMatching(lookup as CFDictionary, &item)
    if status == errSecSuccess, let data = item as? Data { FileHandle.standardOutput.write(data) }
case "put":
    let data = FileHandle.standardInput.readDataToEndOfFile()
    if data.isEmpty || data.count > 4096 { fputs("invalid credential length\n", stderr); exit(2) }
    status = SecItemUpdate(query as CFDictionary, [kSecValueData as String: data] as CFDictionary)
    if status == errSecItemNotFound {
        var addition = query
        addition[kSecValueData as String] = data
        addition[kSecAttrAccessible as String] = kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly
        status = SecItemAdd(addition as CFDictionary, nil)
    }
case "delete": status = SecItemDelete(query as CFDictionary)
default: exit(2)
}
if status == errSecItemNotFound { exit(44) }
if status != errSecSuccess { fputs("Keychain operation failed (\(status))\n", stderr); exit(1) }
