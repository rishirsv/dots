#!/bin/sh
# Patch the ChatGPT browser extension so password-manager inline frames are
# no longer blanked on agent-controlled tabs, then stage it as an unpacked
# extension that keeps the Web Store ID.
#
# Background: content-scripts/foreign-frame-monitor.js blanks every iframe
# from another extension's chrome-extension:// origin. The patch exempts the
# 1Password IDs (stable, beta, nightly); add other managers to ALLOWED below.
# The unpacked copy keeps the ID hehggadaopoacecdllhhajmbjkdcmajg via the
# listing's public "key", which Codex's native messaging host requires.
#
# Usage:
#   scripts/patch-chatgpt-extension.sh [--out DIR] [INSTALLED_DIR_OR_CRX]
# With no source argument, downloads the current Web Store version and
# re-patches it. With an installed extension directory, patches those files
# (the public key is then read from the Web Store download).
#
# The patch fails loudly if the frame check changes shape between releases.
# After building, finish in the browser UI (this clears extension storage,
# so sign in again, and drops running Codex browser sessions):
#   1. Turn on Developer mode in chrome://extensions.
#   2. Remove the Web Store ChatGPT extension.
#   3. "Load unpacked" on the output directory.
# Unpacked extensions do not auto-update: re-run this script, then reload
# the extension.
set -eu

EXT_ID="hehggadaopoacecdllhhajmbjkdcmajg"
# 1Password stable, beta, nightly.
ALLOWED="aeblfdkhhhdcdjpifhhbdiojplfjncoa khgocmkkpikpnmmkgmdnfckapcdkgfaf gejiddohjgogedgjnonbofjigllpkmbf"
OUT="$HOME/.local/share/chatgpt-extension-1password"
EXPECTED_ID="$EXT_ID"
SRC=""
STORE_URL="https://clients2.google.com/service/update2/crx?response=redirect&prodversion=152.0.0.0&acceptformat=crx2,crx3&x=id%3D${EXT_ID}%26installsource%3Dondemand%26uc"

usage() {
  echo "Usage: $0 [--out DIR] [--expected-id ID] [INSTALLED_DIR_OR_CRX]" >&2
}

while [ $# -gt 0 ]; do
  case "$1" in
    --out) OUT="$2"; shift 2;;
    --expected-id) EXPECTED_ID="$2"; shift 2;;
    -h|--help) usage; exit 0;;
    -*) echo "Unknown option: $1" >&2; usage; exit 2;;
    *) SRC="$1"; shift;;
  esac
done

for dep in curl unzip python3; do
  if ! command -v "$dep" >/dev/null 2>&1; then
    echo "Missing required command: $dep" >&2
    exit 2
  fi
done

WORK="$(mktemp -d "${TMPDIR:-/tmp}/chatgpt-ext-XXXXXX")"
cleanup() { rm -rf "$WORK"; }
trap cleanup EXIT INT TERM

CRX="$WORK/source.crx"
SRC_MODE="download"
if [ -n "$SRC" ]; then
  if [ -d "$SRC" ]; then
    SRC_MODE="dir"
  elif [ -f "$SRC" ]; then
    SRC_MODE="crx"
    cp "$SRC" "$CRX"
  else
    echo "Source not found: $SRC" >&2
    exit 2
  fi
fi
if [ "$SRC_MODE" = "download" ]; then
  echo "Downloading current Web Store copy..." >&2
  curl -fsSL "$STORE_URL" -o "$CRX" || {
    echo "Download failed; pass an installed copy or .crx explicitly." >&2
    exit 1
  }
fi

EXT="$WORK/ext"
mkdir -p "$EXT"
if [ "$SRC_MODE" = "dir" ]; then
  cp -R "$SRC/." "$EXT/"
else
  # unzip warns (nonzero exit) about the CRX preamble bytes; success is judged
  # by the payload that lands, not by the exit status.
  unzip -o -q "$CRX" -d "$EXT" 2>/dev/null || true
  if [ ! -f "$EXT/manifest.json" ]; then
    echo "Cannot unzip extension payload." >&2
    exit 1
  fi
fi

MONITOR="$EXT/content-scripts/foreign-frame-monitor.js"
if [ ! -f "$MONITOR" ]; then
  echo "Frame monitor missing: $MONITOR (frame check changed shape?)" >&2
  exit 1
fi

export ALLOWED_IDS="$ALLOWED"
export EXPECTED_ID

# Patch the monitor and resolve the signing key.
python3 - "$MONITOR" "$EXT/manifest.json" "$CRX" "$SRC_MODE" <<'PYEOF'
import base64
import hashlib
import json
import struct
import sys

monitor_path, manifest_path, crx_path, src_mode = sys.argv[1:5]
allowed = __import__("os").environ["ALLOWED_IDS"].split()
expected = __import__("os").environ["EXPECTED_ID"]


def read_varint(data, pos):
    result = 0
    shift = 0
    while True:
        byte = data[pos]
        pos += 1
        result |= (byte & 0x7F) << shift
        if not byte & 0x80:
            return result, pos
        shift += 7


def public_keys(crx):
    data = open(crx, "rb").read()
    magic, version, header_len = struct.unpack("<4sII", data[:12])
    if magic != b"Cr24" or version != 3:
        raise SystemExit("Not a CRX3 file: %r" % crx)
    header = data[12:12 + header_len]
    keys = []
    pos = 0
    while pos < len(header):
        tag, pos = read_varint(header, pos)
        field, wire = tag >> 3, tag & 7
        if wire != 2:
            raise SystemExit("Unexpected CRX header encoding.")
        length, pos = read_varint(header, pos)
        payload = header[pos:pos + length]
        pos += length
        if field in (2, 3):  # sha256_with_rsa / sha256_with_ecdsa proofs
            ppos = 0
            while ppos < len(payload):
                ptag, ppos = read_varint(payload, ppos)
                pfield, pwire = ptag >> 3, ptag & 7
                if pwire != 2:
                    raise SystemExit("Unexpected CRX proof encoding.")
                plength, ppos = read_varint(payload, ppos)
                ppayload = payload[ppos:ppos + plength]
                ppos += plength
                if pfield == 1:
                    keys.append(ppayload)
    return keys


def extension_id(public_key):
    digest = hashlib.sha256(public_key).digest()[:16]
    return "".join(
        chr(ord("a") + ((b >> 4) & 15)) + chr(ord("a") + (b & 15)) for b in digest
    )


text = open(monitor_path).read()
marker = "CODEX_ALLOWED_FOREIGN_EXTENSIONS"
if marker in text:
    missing = [i for i in allowed if i not in text]
    if missing:
        raise SystemExit(
            "Monitor already patched but missing IDs %s; refusing." % ",".join(missing)
        )
    print("Monitor already patched; IDs current.")
else:
    if "chrome-extension://" not in text:
        raise SystemExit("Frame check changed shape: no chrome-extension:// probe.")
    needle = "!==chrome.runtime.id?i:null"
    if needle not in text:
        raise SystemExit("Frame check changed shape: ID comparison not found.")
    anchor = "var foreignFrameMonitor=(function(){"
    if anchor not in text:
        raise SystemExit("Frame check changed shape: script wrapper not found.")
    ids = ",".join('"%s"' % i for i in allowed)
    text = text.replace(
        anchor, anchor + "var %s=[%s];" % (marker, ids), 1
    )
    text = text.replace(
        needle, "!==chrome.runtime.id&&%s.indexOf(i)<0?i:null" % marker, 1
    )
    open(monitor_path, "w").write(text)
    print("Patched monitor; exempt IDs: %s" % " ".join(allowed))

manifest = json.load(open(manifest_path))
if "key" not in manifest:
    if src_mode == "dir":
        print("Installed copy carries no key; reading it from a Web Store download.")
        import subprocess

        download = manifest_path + ".key.crx"
        store_url = (
            "https://clients2.google.com/service/update2/crx"
            "?response=redirect&prodversion=152.0.0.0&acceptformat=crx2,crx3"
            "&x=id%3D" + expected + "%26installsource%3Dondemand%26uc"
        )
        subprocess.run(["curl", "-fsSL", store_url, "-o", download], check=True)
        crx_path = download
    ids = {}
    for key in public_keys(crx_path):
        ids[extension_id(key)] = key
    if expected not in ids:
        raise SystemExit(
            "Downloaded copy has unexpected IDs %s; refusing." % ",".join(sorted(ids))
        )
    manifest["key"] = base64.b64encode(ids[expected]).decode()
    json.dump(manifest, open(manifest_path, "w"), indent=2)
    open(manifest_path, "a").write("\n")
    print("Pinned manifest key for %s." % expected)
else:
    print("Manifest already pins a key.")
PYEOF

if [ -e "$OUT" ]; then
  BACKUP="${OUT}.bak.$(date +%Y%m%d%H%M%S)"
  mv "$OUT" "$BACKUP"
  echo "Backed up $OUT -> $BACKUP"
fi
mkdir -p "$(dirname "$OUT")"
mv "$EXT" "$OUT"
trap - EXIT INT TERM
rm -rf "$WORK"

VERSION="$(python3 -c "import json;print(json.load(open('$OUT/manifest.json'))['version'])")"
echo "Staged $OUT (version $VERSION). Finish in chrome://extensions:"
echo "  1. Turn on Developer mode. 2. Remove the Web Store ChatGPT extension."
echo "  3. Load unpacked: $OUT"
