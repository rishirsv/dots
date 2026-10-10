"""Host-isolated MCP E2E, folder authority, native recovery, and protected file work."""
import asyncio
import json
import os
from pathlib import Path
import signal
import shutil
import subprocess
import sys
import tempfile
import unittest

from execution import Execution
from files import MountedWorkspace, revision
from runtime import folders, load_config, worktrees
from test_protocol import Wire


class UpgradeTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='tunnel-upgrade-')
        self.addCleanup(self.temp.cleanup)
        self.base = Path(self.temp.name)
        self.parent = self.base/'projects'
        self.parent.mkdir()
        self.repo = self.parent/'repo'
        self.repo.mkdir()
        self.configdir = self.base/'private'
        self.configdir.mkdir(mode=0o700)
        self.state = self.base/'recovery'
        self.config = {'tunnel_id': 'test', 'python': sys.executable, 'mounts': {'Code': str(self.parent)},
                       'approved_parents': [str(self.parent)], 'state': str(self.state), 'exec': False}
        (self.configdir/'config.json').write_text(json.dumps(self.config))

    def test_folder_transactions_authority_and_discovery(self):
        before = folders(self.configdir)
        preview = folders(self.configdir, {'Repo': str(self.repo)}, remote=True)
        self.assertTrue(preview['changed'])
        self.assertEqual(load_config(self.configdir)['mounts'], self.config['mounts'])
        applied = folders(self.configdir, {'Repo': str(self.repo)}, apply=True, remote=True, expected_revision=before['revision'])
        self.assertTrue(applied['applied'])
        with self.assertRaisesRegex(ValueError, 'revision conflict'):
            folders(self.configdir, remove=['Repo'], apply=True, remote=True, expected_revision=before['revision'])
        outside = self.base/'outside'
        outside.mkdir()
        with self.assertRaisesRegex(ValueError, 'approved parents'):
            folders(self.configdir, {'Escape': str(outside)}, remote=True)
        with self.assertRaisesRegex(ValueError, 'local operator'):
            folders(self.configdir, approve=[str(outside)], remote=True)
        link = self.parent/'escape'
        link.symlink_to(outside)
        with self.assertRaises(ValueError):
            folders(self.configdir, {'Escape': str(link)}, remote=True)
        self.git('init', '-b', 'main')
        self.git('config', 'user.email', 'test@example.invalid')
        self.git('config', 'user.name', 'Test')
        (self.repo/'note.txt').write_text('note\n')
        self.git('add', '.')
        self.git('commit', '-qm', 'fixture')
        second = self.parent/'feature'
        self.git('worktree', 'add', '-b', 'feature/test', str(second))
        outtree = outside/'outtree'
        self.git('worktree', 'add', '-b', 'outside', str(outtree))
        hook = self.base/'malicious-fsmonitor'
        canary = self.base/'helper-ran'
        hook.write_text('#!/bin/sh\ntouch "'+str(canary)+'"\n')
        hook.chmod(0o700)
        self.git('config', 'core.fsmonitor', str(hook))
        found = worktrees(load_config(self.configdir), branch='feature/test')
        self.assertEqual([e['path'] for e in found['repositories']], [str(second.resolve())])
        self.assertFalse(canary.exists())
        self.assertNotIn(str(outtree.resolve()), [e['path'] for e in worktrees(load_config(self.configdir))['repositories']])

    def test_legacy_config_cannot_self_authorize_new_remote_parent(self):
        del self.config['approved_parents']
        (self.configdir/'config.json').write_text(json.dumps(self.config))
        outside = self.base/'outside'
        outside.mkdir()
        with self.assertRaisesRegex(ValueError, 'approved parents'):
            folders(self.configdir, {'Outside': str(outside)}, remote=True)
        with self.assertRaisesRegex(ValueError, 'approved parents'):
            folders(self.configdir, {'Outside': str(outside)}, apply=True)
        allowed = folders(self.configdir, {'Outside': str(outside)}, approve=[str(outside)], apply=True)
        self.assertTrue(allowed['applied'])

    def git(self, *args):
        return subprocess.run(['/usr/bin/git', '-C', str(self.repo), *args], check=True, capture_output=True)

    def test_protected_file_lifecycle_and_overlapping_aliases(self):
        ws = MountedWorkspace({'Code': self.parent, 'Repo': self.repo}, str(self.state))
        self.addCleanup(ws.close)
        ws.file_operation('mkdir', 'Repo/deep/dir')
        created = ws.file_operation('write', 'Code/repo/deep/dir/.gitignore', content='first\r\nlast')
        self.assertEqual((self.repo/'deep/dir/.gitignore').read_bytes(), b'first\r\nlast')
        with self.assertRaises(ValueError):
            ws.file_operation('write', 'Repo/deep/dir/.gitignore', expected_revision='absent', content='bad')
        moved = ws.file_operation('move', 'Repo/deep/dir/.gitignore', created['revision'], destination='Code/repo/deep/moved.txt')
        self.assertEqual(ws.read_file(moved['destination'])['content'], 'first\r\nlast')
        deleted = ws.file_operation('delete', moved['destination'], created['revision'])
        with self.assertRaises(FileNotFoundError):
            ws.read_file(moved['destination'])
        restored = ws.file_operation('restore', moved['destination'], recovery_copy=deleted['recovery_copy'])
        self.assertEqual(restored['revision'], created['revision'])
        for path in ['Repo/.env', 'Repo/.git/config', 'Repo/secrets/a', 'Repo/x.pem', 'Repo/../escape']:
            with self.assertRaises(ValueError):
                ws.file_operation('write', path, content='secret')
        (self.repo/'link').symlink_to(self.base/'private')
        with self.assertRaises(OSError):
            ws.file_operation('write', 'Repo/link/config.json', content='bad')
        # Both aliases take exactly the same physical mutation lock.
        import stat
        locks = [os.fstat(item.lock_fd) for item in ws.workspaces.values()]
        self.assertEqual((locks[0].st_dev, locks[0].st_ino), (locks[1].st_dev, locks[1].st_ino))
        (self.repo/'exists.txt').write_text('keep')
        with self.assertRaises(ValueError):
            ws.file_operation('move', moved['destination'], created['revision'], destination='Repo/exists.txt')
        self.assertEqual((self.repo/'exists.txt').read_text(), 'keep')

    @unittest.skipUnless(shutil.which('codex'), 'Native Codex required')
    def test_same_mcp_connection_files_reload_diagnosis_and_recovery(self):
        self.config['exec'] = True
        (self.configdir/'config.json').write_text(json.dumps(self.config))
        wire = Wire({'Code': self.parent}, self.state, execution=True, config_directory=self.configdir)
        self.addCleanup(wire.close)
        def call(name, **args):
            value = wire.send('tools/call', {'name': name, 'arguments': args})['result']
            self.assertFalse(value.get('isError'), value)
            return value['structuredContent']
        pid = wire.process.pid
        status = call('tunnel_manage', action='doctor')
        call('tunnel_manage', action='folders', add={'Repo': str(self.repo)}, apply=True, expected_revision=status['config_revision'])
        call('manage_files', action='mkdir', path='Repo/e2e')
        created = call('manage_files', action='write', path='Repo/e2e/note.txt', content='one\r\ntwo')
        call('manage_files', action='move', path=created['path'], expected_revision=created['revision'], destination='Repo/e2e/moved.txt')
        deleted = call('manage_files', action='delete', path='Repo/e2e/moved.txt', expected_revision=created['revision'])
        call('manage_files', action='restore', path='Repo/e2e/moved.txt', recovery_copy=deleted['recovery_copy'])
        self.assertEqual(call('read_file', path='Repo/e2e/moved.txt')['content'], 'one\r\ntwo')
        completed = call('exec_command', cmd='printf BEFORE', workdir=str(self.repo), login=False)
        self.assertEqual(completed['output'], 'BEFORE')
        running = call('exec_command', cmd='printf x >> once.txt; sleep 60', workdir=str(self.repo), login=False, yield_time_ms=250)
        denied = wire.send('tools/call', {'name': 'tunnel_manage', 'arguments': {'action': 'folders', 'remove': ['Repo'], 'apply': True, 'expected_revision': call('tunnel_manage', action='status')['config_revision']}})['result']
        self.assertTrue(denied['isError'])
        # Fault injection only into this test server's own app-server child.
        rows = subprocess.check_output(['/bin/ps', '-axo', 'pid=,ppid=,command='], text=True)
        native = [int(row.split(None, 2)[0]) for row in rows.splitlines() if row.split(None, 2)[1] == str(pid) and 'app-server --stdio' in row]
        self.assertEqual(len(native), 1)
        os.kill(native[0], signal.SIGKILL)
        import time
        for _ in range(20):
            doctor = call('tunnel_manage', action='doctor')
            if doctor['execution']['state'] == 'unhealthy': break
            time.sleep(.05)
        self.assertEqual(doctor['execution']['state'], 'unhealthy')
        repaired = call('tunnel_manage', action='repair')
        self.assertEqual(repaired['repair']['replayed_commands'], 0)
        self.assertEqual(wire.process.pid, pid)
        self.assertEqual(call('tunnel_manage', action='result', operation_id=completed['operation_id'])['output'], 'BEFORE')
        self.assertEqual(call('tunnel_manage', action='result', operation_id=running['operation_id'])['state'], 'uncertain')
        self.assertEqual((self.repo/'once.txt').read_text(), 'x')
        after = call('exec_command', cmd='printf AFTER', workdir=str(self.repo), login=False)
        self.assertEqual(after['output'], 'AFTER')
        # Local atomic config edits reload into this same MCP process.
        folders(self.configdir, remove=['Repo'], apply=True)
        self.assertEqual(call('list_files')['entries'], [{'path': 'Code', 'kind': 'directory'}])
        self.assertEqual(wire.process.pid, pid)


@unittest.skipUnless(shutil.which('codex'), 'Native Codex required')
class ReaderFailureTests(unittest.IsolatedAsyncioTestCase):
    async def test_reader_failure_with_live_process_and_failed_repair(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)/'project'
            root.mkdir()
            executor = Execution([root])
            try:
                await executor.start()
                process = executor.process
                executor.reader.cancel()
                await executor.reader
                self.assertIsNone(process.returncode)
                self.assertEqual(executor.health()['state'], 'unhealthy')
                executor.codex = '/nonexistent/codex'
                with self.assertRaises(OSError): await executor.repair()
                executor.codex = shutil.which('codex')
                await executor.repair()
                result = await executor.exec_command('printf RECOVERED', workdir=str(root), login=False)
                self.assertEqual(result['output'], 'RECOVERED')
            finally:
                await executor.close()


if __name__ == '__main__': unittest.main()
