import argparse
import csv
import json
import re
from pathlib import Path
from statistics import mean
from typing import Dict, List, Tuple


def load_latest_csv(evals_dir: Path) -> Path:
    csv_files = sorted(evals_dir.glob('*.csv'), key=lambda p: p.stat().st_mtime, reverse=True)
    if not csv_files:
        raise FileNotFoundError(f"No CSV files found in {evals_dir}")
    return csv_files[0]


def extract_candidate_outputs(row: Dict[str, str]) -> List[Tuple[str, str]]:
    outputs = []
    for key, value in row.items():
        if key.startswith('prompt_') and key.endswith('_output') and value:
            parts = key.split('_')
            if len(parts) >= 3 and parts[1].isdigit():
                outputs.append((f"prompt_{parts[1]}", value))
    outputs.sort(key=lambda item: int(item[0].split('_')[1]))
    return outputs


def detect_template(text: str) -> str:
    lowered = text.lower()
    if 'research' in lowered and ('citation' in lowered or 'references' in lowered):
        return 'Research'
    if re.search(r'^# ', text, flags=re.MULTILINE):
        return 'Standard'
    return 'Essential'


def score_role_fidelity(text: str) -> int:
    failure_markers = [
        'here is your', 'as requested, here', 'the answer is', 'summary:', 'conclusion:'
    ]
    if any(marker in text.lower() for marker in failure_markers):
        return 2
    instruction_markers = ['your task is', 'instructions', 'output', 'deliverable']
    if any(marker in text.lower() for marker in instruction_markers):
        return 5
    return 4


def score_template_and_length(text: str, expected: str) -> int:
    detected = detect_template(text)
    score = 5 if detected.lower() in expected.lower() else 3
    word_count = len(text.split())
    if word_count > 500:
        score = min(score, 3)
    return score


def score_clarity_and_brevity(text: str) -> int:
    word_count = len(text.split())
    if word_count <= 200:
        return 5
    if word_count <= 350:
        return 4
    if word_count <= 500:
        return 3
    return 2


def score_constraint_alignment(text: str, checks: Dict[str, str]) -> int:
    lowered = text.lower()
    if checks.get('external') is False and ('browse' in lowered or 'http' in lowered or 'citation' in lowered):
        return 2
    fence = checks.get('fence')
    if fence == 'markdown_or_xml':
        if '```' in text or '<' in text:
            return 5
        return 3
    return 4


def score_output_spec_quality(text: str) -> int:
    has_sections = bool(re.search(r'^# ', text, flags=re.MULTILINE))
    has_output = 'output' in text.lower()
    if has_sections and has_output:
        return 5
    if has_output:
        return 4
    return 3


def score_tone_and_style(text: str) -> int:
    if '!' in text:
        return 3
    return 5


def build_strengths_issues(scores: Dict[str, int], detected: str, expected: str) -> Tuple[str, str]:
    strengths = []
    issues = []
    if scores['role_fidelity'] >= 4:
        strengths.append('Maintains instruction-only stance.')
    if scores['template_and_length'] == 5:
        strengths.append('Template matches expected structure with reasonable length.')
    if scores['clarity_and_brevity'] >= 4:
        strengths.append('Concise and readable guidance.')
    if detected.lower() != expected.lower():
        issues.append(f"Template detection mismatch: expected {expected}, found {detected}.")
    if scores['constraint_alignment'] <= 3:
        issues.append('Constraints only partially addressed or missing formatting fence.')
    if scores['output_spec_quality'] <= 3:
        issues.append('Output formatting could be clearer.')
    if not issues:
        issues.append('No critical issues detected; consider minor polish if needed.')
    return ' '.join(strengths) or 'Clear framing of the downstream task.', ' '.join(issues)


def evaluate_candidate(candidate_id: str, text: str, expected: str, checks: Dict[str, str]) -> Dict:
    detected = detect_template(text)
    scores = {
        'role_fidelity': score_role_fidelity(text),
        'template_and_length': score_template_and_length(text, expected),
        'clarity_and_brevity': score_clarity_and_brevity(text),
        'constraint_alignment': score_constraint_alignment(text, checks),
        'output_spec_quality': score_output_spec_quality(text),
        'tone_and_style': score_tone_and_style(text),
    }
    overall = round(mean(scores.values()))
    strengths, issues = build_strengths_issues(scores, detected, expected)
    return {
        'id': candidate_id,
        'overall_score': int(overall),
        'scores': scores,
        'strengths': strengths,
        'issues': issues,
    }


def parse_checks(raw_checks: str) -> Dict[str, str]:
    if not raw_checks:
        return {}
    try:
        return json.loads(raw_checks)
    except json.JSONDecodeError:
        # Attempt to fix common CSV escaping issues
        cleaned = raw_checks.replace('""', '"')
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            return {}


def evaluate_row(row: Dict[str, str]) -> Dict:
    expected_template = row.get('expected_template', '').strip() or 'Standard'
    checks = parse_checks(row.get('checks', ''))
    candidates = extract_candidate_outputs(row)
    evaluations = [
        evaluate_candidate(f"{row.get('id', 'case')}_{cid}", text, expected_template, checks)
        for cid, text in candidates
    ]
    if not evaluations:
        return {}
    # Rank by overall_score descending
    evaluations.sort(key=lambda ev: ev['overall_score'], reverse=True)
    best_score = evaluations[0]['overall_score']
    for ev in evaluations:
        ev['preferred'] = ev['overall_score'] == best_score
    ranking = [ev['id'] for ev in evaluations]
    # Aggregate common optimization themes
    optimizations = []
    if any(ev['scores']['template_and_length'] < 5 for ev in evaluations):
        optimizations.append('Tighten template routing to match expected structure.')
    if any(ev['scores']['constraint_alignment'] < 5 for ev in evaluations):
        optimizations.append('Reinforce constraint parsing, especially fences and external access rules.')
    if any(ev['scores']['clarity_and_brevity'] < 5 for ev in evaluations):
        optimizations.append('Trim verbosity to stay within target word budgets.')
    return {
        'per_candidate': evaluations,
        'ranking': ranking,
        'meta_prompt_optimizations': optimizations,
    }


def grade_file(path: Path) -> Dict[str, Dict]:
    results: Dict[str, Dict] = {}
    with path.open(newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            case_id = row.get('id') or f"case_{len(results)+1}"
            evaluation = evaluate_row(row)
            if evaluation:
                results[case_id] = evaluation
    return results


def main() -> None:
    parser = argparse.ArgumentParser(description='Grade MetaPrompt responses from CSV export.')
    parser.add_argument('--csv', type=Path, help='Path to CSV file. Defaults to the most recent in evals/.')
    parser.add_argument('--output', type=Path, help='Optional path to write JSON results. Prints to stdout by default.')
    args = parser.parse_args()

    evals_dir = Path(__file__).resolve().parent
    csv_path = args.csv or load_latest_csv(evals_dir)

    results = grade_file(csv_path)
    serialized = json.dumps(results, indent=2)

    if args.output:
        args.output.write_text(serialized)
    else:
        print(serialized)


if __name__ == '__main__':
    main()
