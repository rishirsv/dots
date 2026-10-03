import Foundation
import Vision
import ImageIO
import CoreGraphics

var capturedDirectory: URL?

func fail(_ message: String, code: Int32 = 1) -> Never {
    if let directory = capturedDirectory { try? FileManager.default.removeItem(at: directory) }
    FileHandle.standardError.write(Data((message + "\n").utf8))
    exit(code)
}

let arguments = Array(CommandLine.arguments.dropFirst())
if arguments == ["--permission-status"] {
    print(CGPreflightScreenCaptureAccess() ? "Screen capture already allowed" : "Screen capture not allowed; no permission requested")
    exit(0)
}
if arguments.count != 1 {
    fail("Usage: tinycast-ocr <image-path>; pass an empty path to choose a screen area")
}
let path = arguments[0].trimmingCharacters(in: .whitespacesAndNewlines)
let capture = path.isEmpty
let directory = FileManager.default.temporaryDirectory.appendingPathComponent("tinycast-ocr-" + UUID().uuidString)
var imageURL: URL
if capture {
    guard CGPreflightScreenCaptureAccess() else {
        fail("Area capture needs macOS Screen Recording approval for the requesting app. No permission was requested. Run OCR again with a saved image path to use file OCR without screen access.", code: 2)
    }
    do { try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: false) }
    catch { fail("Cannot create temporary OCR directory: \(error.localizedDescription)") }
    capturedDirectory = directory
    imageURL = directory.appendingPathComponent("area.png")
    let process = Process()
    process.executableURL = URL(fileURLWithPath: "/usr/sbin/screencapture")
    process.arguments = ["-i", "-x", "-t", "png", imageURL.path]
    do { try process.run(); process.waitUntilExit() }
    catch { try? FileManager.default.removeItem(at: directory); fail("Cannot start area capture: \(error.localizedDescription)") }
    if process.terminationStatus != 0 || !FileManager.default.fileExists(atPath: imageURL.path) {
        try? FileManager.default.removeItem(at: directory)
        fail("Area capture cancelled or unavailable", code: 3)
    }
} else {
    imageURL = URL(fileURLWithPath: (path as NSString).expandingTildeInPath)
}
defer { if capture { try? FileManager.default.removeItem(at: directory) } }
guard let source = CGImageSourceCreateWithURL(imageURL as CFURL, nil),
      let image = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
    fail("Cannot read the image. Provide a local PNG, JPEG, or another supported image file.")
}
let request = VNRecognizeTextRequest()
request.recognitionLevel = .fast
request.revision = VNRecognizeTextRequestRevision1
request.usesLanguageCorrection = true
request.recognitionLanguages = ["en-US"]
request.usesCPUOnly = true
do {
    try VNImageRequestHandler(cgImage: image).perform([request])
    let text = (request.results ?? []).compactMap { $0.topCandidates(1).first?.string }.joined(separator: "\n")
    guard !text.isEmpty else { fail("No readable text found") }
    print(text)
} catch { fail("OCR failed: \(error.localizedDescription)") }
