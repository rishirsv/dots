#!/usr/bin/env python3
"""Run all glossary generation tests."""

import subprocess
import sys
from pathlib import Path

# Project root
ROOT = Path(__file__).parent
TEMPLATES = ROOT / "templates"
FIXTURES = ROOT / "tests" / "fixtures"
OUTPUT = ROOT / "tests" / "output"

# Ensure output directory exists
OUTPUT.mkdir(exist_ok=True)

def run_glossary_test(name, input_file):
    """Run a single glossary test."""
    output_file = OUTPUT / f"{name}.pptx"
    cmd = [
        "python3",
        "core/glossary_generator.py",
        "--template", str(TEMPLATES / "glossary_template.pptx"),
        "--input", str(input_file),
        "--output", str(output_file)
    ]
    
    print(f"\n{'='*60}")
    print(f"Running: {name}")
    print(f"{'='*60}")
    result = subprocess.run(cmd, cwd=ROOT)
    
    if result.returncode != 0:
        print(f"❌ FAILED: {name}")
        return False
    print(f"✅ PASSED: {name}")
    return True

def main():
    """Run all glossary tests."""
    print("\n🔬 GLOSSARY GENERATOR TEST SUITE")
    print("="*60)
    
    tests = [
        ("glossary_small", FIXTURES / "small_glossary.json"),
        ("glossary_medium", FIXTURES / "medium_glossary.json"),
        ("glossary_large", FIXTURES / "large_glossary.json"),
    ]
    
    results = []
    for name, input_file in tests:
        results.append(run_glossary_test(name, input_file))
    
    # Summary
    print(f"\n{'='*60}")
    print("SUMMARY")
    print(f"{'='*60}")
    passed = sum(results)
    total = len(results)
    print(f"Passed: {passed}/{total}")
    
    if passed == total:
        print("✅ All glossary tests passed!")
        return 0
    else:
        print(f"❌ {total - passed} test(s) failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())
