import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location('tinycast_workflows', ROOT / 'scripts/sync-tinycast-workflows.py')
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)

class TinycastWorkflowTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        (self.root / 'configs/tinycast').mkdir(parents=True)
        self.config = json.loads((ROOT / 'configs/tinycast/workflows.json').read_text())
        (self.root / 'configs/tinycast/workflows.json').write_text(json.dumps(self.config))
        self.quick = self.root / 'quick-actions.json'
        self.quick.write_text(json.dumps([{'id':'synthetic-unrelated', 'name':'Unrelated fixture'}]))
        self.karabiner = self.root / 'karabiner.json'
        self.karabiner.write_text(json.dumps({'profiles':[{'selected':True, 'complex_modifications':{'rules':[]}}]}))
        self.live = {'quickActionsEnabled':True, 'hotkey.command:clipboard-history':self.combo(9,2048)}
        self.paths = patch.multiple(MODULE, ROOT=self.root, QUICK=self.quick, KARABINER=self.karabiner, HELPER_ROOT=self.root / 'helper')
        self.paths.start()
        self.addCleanup(self.paths.stop)

    @staticmethod
    def combo(code, modifiers=6912):
        return json.dumps({'combo':{'_0':{'carbonModifiers':modifiers,'carbonKeyCode':code}}})

    def invoke(self):
        with patch.object(MODULE,'defaults',return_value=self.live), patch('sys.argv',['helper']), patch.object(MODULE.subprocess,'run') as run:
            result = MODULE.main()
            run.assert_not_called()
            return result

    def test_dry_run_preserves_unrelated_files(self):
        before = self.quick.read_bytes(), self.karabiner.read_bytes()
        self.assertEqual(self.invoke(),0)
        self.assertEqual(before,(self.quick.read_bytes(),self.karabiner.read_bytes()))
        self.assertFalse((self.root / 'helper').exists())

    def test_rejects_owned_shortcut_collision(self):
        self.live['hotkey.app.synthetic'] = self.combo(34)
        with self.assertRaisesRegex(RuntimeError,'Shortcut conflict'): self.invoke()

    def test_rejects_history_alias_collision(self):
        self.live['hotkey.app.synthetic'] = self.combo(4)
        with self.assertRaisesRegex(RuntimeError,'Hyper\\+H conflict'): self.invoke()

    def test_rejects_ocr_shortcut_collision(self):
        self.live['hotkey.app.synthetic'] = self.combo(31)
        with self.assertRaisesRegex(RuntimeError,'Shortcut conflict'): self.invoke()

    def test_preserves_history_binding_when_different(self):
        self.live['hotkey.command:clipboard-history'] = self.combo(9,2560)
        with self.assertRaisesRegex(RuntimeError,'History must already use Option\\+V'): self.invoke()

    def test_rejects_unrelated_custom_command_name_collision(self):
        self.live['customCommands'] = json.dumps([{'id':'synthetic-unrelated','name':'OCR image or area'}]).encode()
        with self.assertRaisesRegex(RuntimeError,'Custom command name conflict'): self.invoke()

if __name__ == '__main__':
    unittest.main()
