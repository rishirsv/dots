#!/usr/bin/env python3
"""Run the full test suite (Lingo + glossary engine)."""

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).parent

def run_command(description, cmd):
    """Run a command and report results."""
    print(f"\n{'='*60}")
    print(f"{description}")
    print(f"{'='*60}")
    result = subprocess.run(cmd, cwd=ROOT)
    return result.returncode == 0

def main():
    """Run complete test suite."""
    print("\n" + "="*60)
    print("🧪 KPMG-PPTX TEST SUITE (LINGO)")
    print("="*60)
    
    results = []
    
    # 1. Unit + integration tests
    results.append(run_command(
        "1️⃣  Unit/Integration Tests (unittest discover)",
        ["python3", "-m", "unittest", "discover", "tests", "-v"]
    ))
    
    # 2. Glossary tests
    results.append(run_command(
        "2️⃣  Glossary Generator Smoke Tests (CLI)",
        ["python3", "run_glossary_tests.py"]
    ))
    
    # Summary
    print(f"\n{'='*60}")
    print("FINAL SUMMARY")
    print(f"{'='*60}")
    
    test_names = ["Unit/Integration Tests", "Glossary Smoke Tests"]
    for name, passed in zip(test_names, results):
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{name}: {status}")
    
    passed_count = sum(results)
    total_count = len(results)
    
    print(f"\nTotal: {passed_count}/{total_count} test suites passed")
    
    if passed_count == total_count:
        print("\n🎉 All tests passed!")
        return 0
    else:
        print(f"\n❌ {total_count - passed_count} test suite(s) failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())
