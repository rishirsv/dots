"""Bounded POSIX file operations; no shell or model runtime.

Directory descriptors and O_NOFOLLOW prevent path/symlink traversal. The
operator and other local processes are trusted: editors must not concurrently
change a file during the short revision-check/replace window. This is not an
OS sandbox against a malicious process running as the same user.
"""
from contextlib import contextmanager
import fcntl
import hashlib
import os
from pathlib import Path
import secrets
import stat
import threading

MAX_BYTES = 1_048_576
MAX_TEXT = 16_000
SKIP = {"node_modules", "vendor", "dist", "build", "venv", "__pycache__"}


def revision(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def components(path: str, directory: bool = False) -> list[str]:
    if directory and path == ".":
        return []
    if not path or len(path) > 2048 or "\\" in path or any(ord(c) < 32 for c in path):
        raise ValueError("Use a bounded project-relative path")
    parts = path.split("/")
    for p in parts:
        name = p.casefold()
        if (not p or name.startswith(".") or name in SKIP or
            name in {"credentials", "credentials.json", "auth.json", "secrets", "id_rsa", "id_ed25519"} or
            name.endswith((".pem", ".key", ".p12", ".pfx", ".sqlite", ".db"))):
            raise ValueError("Path is outside dots-tunnel's permitted file surface")
    return parts


def patch_text(original: bytes | None, patch: str) -> tuple[str, bytes]:
    if len(patch.encode("utf-8")) > MAX_BYTES:
        raise ValueError("Patch exceeds 1 MiB")
    lines = patch.splitlines()
    if len(lines) < 4 or lines[0] != "*** Begin Patch" or lines[-1] != "*** End Patch":
        raise ValueError("Expected Codex Begin/End Patch markers")
    header, body = lines[1], lines[2:-1]
    if any(line.startswith("*** ") for line in body):
        raise ValueError("Only one file; no delete, rename, or EOF directives")
    if header.startswith("*** Add File: "):
        path = header.removeprefix("*** Add File: ")
        if original is not None:
            raise ValueError("Create conflict: file already exists")
        if not body or any(not line.startswith("+") for line in body):
            raise ValueError("Add File requires + prefixed lines")
        result = "\n".join(line[1:] for line in body) + "\n"
    elif header.startswith("*** Update File: "):
        path = header.removeprefix("*** Update File: ")
        if original is None:
            raise ValueError("Update requires an existing file")
        text = original.decode("utf-8")
        if "\r" in text or (text and not text.endswith("\n")):
            raise ValueError("Updates require LF text ending with a newline")
        # Prefix anchors each match to a line boundary. str.find avoids the
        # quadratic allocation of a list slice at every possible line offset.
        source = "\n" + text
        result_lines, cursor, i = [], 0, 0
        while i < len(body):
            if body[i] != "@@":
                raise ValueError("Each update hunk starts with exactly @@")
            i += 1
            old, new = [], []
            changed = False
            while i < len(body) and body[i] != "@@":
                line = body[i]
                if not line or line[0] not in " +-":
                    raise ValueError("Hunk lines require space, +, or - prefixes")
                if line[0] != "+":
                    old.append(line[1:] + "\n")
                if line[0] != "-":
                    new.append(line[1:] + "\n")
                changed |= line[0] != " "
                i += 1
            if not old or not changed:
                raise ValueError("Each hunk needs old context and an actual edit")
            before, after = "".join(old), "".join(new)
            needle = "\n" + before
            at = source.find(needle, cursor)
            if at < 0 or source.find(needle, at + 1) >= 0:
                raise ValueError("Patch context must match exactly once; include more context")
            result_lines.append(text[cursor:at])
            result_lines.append(after)
            cursor = at + len(before)
        if not body:
            raise ValueError("Update requires a hunk")
        result = "".join(result_lines) + text[cursor:]
    else:
        raise ValueError("Only Add File and Update File are supported")
    components(path)
    encoded = result.encode("utf-8")
    if len(encoded) > MAX_BYTES or "\x00" in result:
        raise ValueError("Only UTF-8 text up to 1 MiB is supported")
    return path, encoded


class Workspace:
    def __init__(self, root: str, state: str):
        self.root = Path(root).resolve(strict=True)
        if self.root in {Path("/"), Path.home()} or not self.root.is_dir():
            raise ValueError("Choose a project directory, not the home or filesystem root")
        state_path = Path(state).absolute()
        state_path.mkdir(mode=0o700, parents=True, exist_ok=True)
        self.state = state_path.resolve(strict=True)
        if self.state == self.root or self.root in self.state.parents:
            raise ValueError("Recovery state must be outside the exposed project")
        state_stat = os.lstat(state_path)
        if stat.S_ISLNK(state_stat.st_mode) or state_stat.st_uid != os.getuid() or state_stat.st_mode & 0o077:
            raise ValueError("Recovery directory must be owner-only and not a symlink")
        self.mutex = threading.Lock()
        # Every process for this root uses the same lock, even when MCP starts
        # another stdio worker. State selection is local operator authority.
        lockname = "lock-" + revision(str(self.root).encode())
        opened = []
        try:
            self.root_fd = os.open(self.root, os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW)
            opened.append(self.root_fd)
            self.state_fd = os.open(self.state, os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW)
            opened.append(self.state_fd)
            self.lock_fd = os.open(lockname, os.O_RDWR | os.O_CREAT | os.O_NOFOLLOW, 0o600, dir_fd=self.state_fd)
        except BaseException:
            for fd in opened:
                os.close(fd)
            raise

    def close(self):
        for fd in (self.lock_fd, self.state_fd, self.root_fd):
            os.close(fd)

    @contextmanager
    def directory(self, parts: list[str]):
        fd = os.dup(self.root_fd)
        try:
            for part in parts:
                child = os.open(part, os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW, dir_fd=fd)
                os.close(fd)
                fd = child
            yield fd
        finally:
            os.close(fd)

    def _read(self, fd: int, name: str) -> tuple[bytes, os.stat_result]:
        handle = os.open(name, os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK, dir_fd=fd)
        try:
            info = os.fstat(handle)
            if not stat.S_ISREG(info.st_mode) or info.st_nlink != 1 or info.st_size > MAX_BYTES:
                raise ValueError("Only single-link regular text files up to 1 MiB are allowed")
            with os.fdopen(os.dup(handle), "rb") as stream:
                data = stream.read(MAX_BYTES + 1)
            if len(data) > MAX_BYTES or b"\x00" in data:
                raise ValueError("File is binary or too large")
            data.decode("utf-8")
            after = os.fstat(handle)
            if (info.st_mtime_ns, info.st_size) != (after.st_mtime_ns, after.st_size):
                raise ValueError("File changed during read; inspect it again")
            return data, info
        finally:
            os.close(handle)

    def read_file(self, path: str, start_line: int = 1, limit: int = 100) -> dict:
        if not 1 <= start_line <= 1_000_000 or not 1 <= limit <= 200:
            raise ValueError("start_line must be positive; limit is 1..200")
        parts = components(path)
        with self.directory(parts[:-1]) as fd:
            data, _ = self._read(fd, parts[-1])
        lines = data.decode("utf-8").splitlines(keepends=True)
        selected = lines[start_line - 1:start_line - 1 + limit]
        content = "".join(selected)
        if len(content) > MAX_TEXT:
            raise ValueError("Requested lines exceed 16000 characters; request fewer lines")
        end = start_line - 1 + len(selected)
        return {"path": path, "revision": revision(data), "content": content,
                "start_line": start_line, "next_line": end + 1 if end < len(lines) else None}

    def list_files(self, path: str = ".", offset: int = 0, limit: int = 100) -> dict:
        if not 0 <= offset <= 5000 or not 1 <= limit <= 200:
            raise ValueError("offset is 0..5000; limit is 1..200")
        parts = components(path, directory=True)
        entries = []
        with self.directory(parts) as fd:
            with os.scandir(fd) as iterator:
                for i, entry in enumerate(iterator):
                    if i >= 5000:
                        raise ValueError("Directory too large; select a smaller project")
                    try:
                        components(entry.name)
                        info = entry.stat(follow_symlinks=False)
                        if stat.S_ISDIR(info.st_mode) or (stat.S_ISREG(info.st_mode) and info.st_nlink == 1):
                            entries.append({"path": "/".join(parts + [entry.name]),
                                            "kind": "directory" if stat.S_ISDIR(info.st_mode) else "file"})
                    except (ValueError, OSError):
                        continue
        entries.sort(key=lambda x: x["path"])
        return {"entries": entries[offset:offset + limit],
                "next_offset": offset + limit if offset + limit < len(entries) else None}

    def search_files(self, query: str, path: str = ".", limit: int = 30) -> dict:
        if not query or len(query) > 200 or not 1 <= limit <= 100:
            raise ValueError("Use a literal query of 1..200 characters and limit 1..100")
        pending, matches, count, total, directories = [path], [], 0, 0, 0
        omitted = False
        while pending and count < 200 and total < 8 * MAX_BYTES and directories < 200:
            current = pending.pop()
            directories += 1
            page = self.list_files(current, limit=200)
            if page["next_offset"] is not None:
                return {"matches": matches, "truncated": True, "reason": "Narrow the directory"}
            for entry in page["entries"]:
                if entry["kind"] == "directory":
                    if len(pending) < 200:
                        pending.append(entry["path"])
                    else:
                        omitted = True
                    continue
                if count >= 200 or total >= 8 * MAX_BYTES:
                    return {"matches": matches, "truncated": True}
                count += 1
                parts = components(entry["path"])
                try:
                    with self.directory(parts[:-1]) as fd:
                        data, _ = self._read(fd, parts[-1])
                except (OSError, ValueError, UnicodeError):
                    continue
                total += len(data)
                for n, line in enumerate(data.decode("utf-8").splitlines(), 1):
                    if query in line:
                        matches.append({"path": entry["path"], "line": n, "text": line[:300]})
                        if len(matches) == limit:
                            return {"matches": matches, "truncated": True}
        return {"matches": matches, "truncated": bool(pending) or omitted}

    def apply_patch(self, input: str, expected_revision: str) -> dict:
        lines = input.splitlines()
        if len(lines) < 2 or not lines[1].startswith(("*** Add File: ", "*** Update File: ")):
            raise ValueError("Expected Add File or Update File patch")
        parts = components(lines[1].split(": ", 1)[1])
        with self.mutex:
            fcntl.flock(self.lock_fd, fcntl.LOCK_EX)
            try:
                with self.directory(parts[:-1]) as fd:
                    try:
                        original, info = self._read(fd, parts[-1])
                    except FileNotFoundError:
                        original, info = None, None
                    actual = "absent" if original is None else revision(original)
                    if expected_revision != actual:
                        raise ValueError("Revision conflict: read the file and reconcile before editing")
                    path, updated = patch_text(original, input)
                    if original == updated:
                        raise ValueError("Patch makes no change")
                    backup = None
                    if original is not None:
                        backup = "original-" + actual
                        try:
                            out = os.open(backup, os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW,
                                          0o600, dir_fd=self.state_fd)
                        except FileExistsError:
                            saved, _ = self._read(self.state_fd, backup)
                            if saved != original:
                                raise ValueError("Recovery copy failed integrity verification")
                        else:
                            with os.fdopen(out, "wb") as stream:
                                stream.write(original)
                                stream.flush()
                                os.fsync(stream.fileno())
                        os.fsync(self.state_fd)
                    temp = ".dots-tunnel-" + secrets.token_hex(12)
                    out = os.open(temp, os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW,
                                  0o600, dir_fd=fd)
                    committed = False
                    try:
                        with os.fdopen(out, "wb") as stream:
                            stream.write(updated)
                            os.fchmod(stream.fileno(), (stat.S_IMODE(info.st_mode) & 0o777) if info else 0o600)
                            stream.flush()
                            os.fsync(stream.fileno())
                        if original is None:
                            # link is an atomic no-clobber create; unlike replace,
                            # it cannot overwrite a file created after our check.
                            os.link(temp, parts[-1], src_dir_fd=fd, dst_dir_fd=fd, follow_symlinks=False)
                            os.unlink(temp, dir_fd=fd)
                        else:
                            latest, latest_info = self._read(fd, parts[-1])
                            if latest != original or latest_info.st_ino != info.st_ino:
                                raise ValueError("File changed before commit; no edit applied")
                            os.replace(temp, parts[-1], src_dir_fd=fd, dst_dir_fd=fd)
                        committed = True
                        os.fsync(fd)
                    except Exception as error:
                        if committed:
                            raise ValueError("Write committed but durability check failed; read before retrying") from error
                        raise
                    finally:
                        try:
                            os.unlink(temp, dir_fd=fd)
                        except FileNotFoundError:
                            pass
                    return {"path": path, "revision": revision(updated), "previous_revision": actual,
                            "recovery_copy": backup, "bytes": len(updated)}
            finally:
                fcntl.flock(self.lock_fd, fcntl.LOCK_UN)


class MountedWorkspace:
    """Virtual named roots; never opens their shared parent directory."""

    def __init__(self, roots: dict, state: str):
        if not roots or any(len(components(name)) != 1 for name in roots):
            raise ValueError("Mounts require nonempty single-component names")
        resolved = {name: Path(root).resolve(strict=True) for name, root in roots.items()}
        state_path = Path(state).resolve()
        for root in resolved.values():
            if root in {Path('/'), Path.home()} or not root.is_dir():
                raise ValueError("Mount a project directory, not home or filesystem root")
            if state_path == root or root in state_path.parents:
                raise ValueError("Recovery state must be outside every mount")
        Path(state).mkdir(mode=0o700, parents=True, exist_ok=True)
        info = os.lstat(state)
        if stat.S_ISLNK(info.st_mode) or info.st_uid != os.getuid() or info.st_mode & 0o077:
            raise ValueError("Recovery directory must be owner-only and not a symlink")
        self.workspaces = {}
        try:
            for name, root in resolved.items():
                # Independent roots cannot race while creating identical backups.
                self.workspaces[name] = Workspace(str(root), str(Path(state) / revision(str(root).encode())))
        except BaseException:
            self.close()
            raise

    def close(self):
        for workspace in self.workspaces.values():
            workspace.close()
        self.workspaces.clear()

    def route(self, path, directory=False):
        parts = components(path)
        name = parts[0]
        if name not in self.workspaces or (len(parts) == 1 and not directory):
            raise ValueError("Use an authorized mount followed by a relative file path")
        return name, self.workspaces[name], '/'.join(parts[1:]) or '.'

    def list_files(self, path='.', offset=0, limit=100):
        if path == '.':
            if not 0 <= offset <= 5000 or not 1 <= limit <= 200:
                raise ValueError("offset is 0..5000; limit is 1..200")
            entries = [{"path": name, "kind": "directory"} for name in sorted(self.workspaces)]
            return {"entries": entries[offset:offset + limit],
                    "next_offset": offset + limit if offset + limit < len(entries) else None}
        name, workspace, relative = self.route(path, directory=True)
        result = workspace.list_files(relative, offset, limit)
        for entry in result['entries']:
            entry['path'] = name + '/' + entry['path']
        return result

    def read_file(self, path, start_line=1, limit=100):
        name, workspace, relative = self.route(path)
        result = workspace.read_file(relative, start_line, limit)
        result['path'] = name + '/' + result['path']
        return result

    def search_files(self, query, path='.', limit=30):
        if path == '.':
            raise ValueError("List available mounts, then search one named directory")
        name, workspace, relative = self.route(path, directory=True)
        result = workspace.search_files(query, relative, limit)
        for match in result['matches']:
            match['path'] = name + '/' + match['path']
        return result

    def apply_patch(self, input, expected_revision):
        if len(input.encode('utf-8')) > MAX_BYTES:
            raise ValueError("Patch exceeds 1 MiB")
        lines = input.splitlines()
        if len(lines) < 2 or not lines[1].startswith(('*** Add File: ', '*** Update File: ')):
            raise ValueError("Expected Add File or Update File patch")
        directive, path = lines[1].split(': ', 1)
        name, workspace, relative = self.route(path)
        lines[1] = directive + ': ' + relative
        result = workspace.apply_patch('\n'.join(lines), expected_revision)
        result['path'] = name + '/' + result['path']
        if result['recovery_copy']:
            result['recovery_copy'] = workspace.state.name + '/' + result['recovery_copy']
        return result
