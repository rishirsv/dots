import importlib.util
from pathlib import Path
import subprocess
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / 'scripts/mac-studio'
sys.path.insert(0, str(SCRIPTS))
import common
import benchmark
import verify


class MacStudioTests(unittest.TestCase):
    def test_default_never_executes(self):
        def forbidden(*a, **kw):
            self.fail('dry run executed subprocess')
        self.assertEqual(common.collect([('test', ['tool'])], runner=forbidden)[0]['state'], 'planned')

    def test_error_is_unknown(self):
        def missing(*a, **kw):
            raise FileNotFoundError()
        self.assertEqual(common.collect([('test', ['tool'])], True, missing)[0]['state'], 'unknown')

    def test_failed_command_is_not_pass(self):
        def failed(*a, **kw):
            return subprocess.CompletedProcess(a[0], 1, '', 'private error')
        r = common.collect([('test', ['tool'])], True, failed)[0]
        self.assertEqual(r['state'], 'unknown')
        self.assertNotIn('private error', str(r))

    def test_private_peer_validation(self):
        for peer in ['100.100.1.2', 'fd7a:115c:a1e0::1', 'studio.example.ts.net']:
            self.assertEqual(verify.private_peer(peer), peer)
        for peer in ['--help', '8.8.8.8', '127.0.0.1', 'studio;id', 'studio..ts.net']:
            with self.assertRaises(Exception):
                verify.private_peer(peer)

    def test_status_redaction(self):
        rows = [{'check': 'tailscale_status', 'state': 'observed', 'output': '{"BackendState":"Running","Self":{"Online":true,"HostName":"private"},"Peer":{"secret":"hidden"}}'}]
        r = verify.summarize_status(rows)
        self.assertEqual(r[0]['output'], {'BackendState': 'Running', 'Online': True})
        self.assertNotIn('private', str(r))
        self.assertNotIn('hidden', str(r))

    def test_benchmark_health_and_invalid_rows(self):
        row = dict(mode='synthetic', jobs='2', completed='2', seconds='60', failures='0', pressure='normal', responsive='yes')
        self.assertEqual(benchmark.summarize([row])[0]['jobs_per_minute'], 2)
        self.assertTrue(benchmark.summarize([row])[0]['healthy'])
        self.assertFalse(benchmark.summarize([{**row, 'pressure': 'warning'}])[0]['healthy'])
        for seconds in ['0', '-1', 'nan', 'inf']:
            with self.assertRaises(ValueError):
                benchmark.summarize([{**row, 'seconds': seconds}])

    def test_plan_cli_has_no_apply(self):
        r = subprocess.run([sys.executable, str(SCRIPTS/'plan.py'), 'tailscale', '--apply'], capture_output=True)
        self.assertNotEqual(r.returncode, 0)


if __name__ == '__main__':
    unittest.main()
