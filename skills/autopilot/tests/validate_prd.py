#!/usr/bin/env python3
"""Validate autopilot PRD JSON files."""

import json
import sys

def _validate_story_id_is_unique(errors: list[str], seen_ids: set[str], story_id: str, label: str) -> None:
    if story_id in seen_ids:
        errors.append(f"Duplicate story id '{story_id}' in {label}")
    else:
        seen_ids.add(story_id)


def validate_prd_json(filepath: str) -> list[str]:
    """Validate PRD JSON file. Returns list of errors."""
    errors: list[str] = []

    try:
        with open(filepath, "r") as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        return [f"Invalid JSON: {e.msg} (line {e.lineno} column {e.colno})"]
    except Exception as e:
        return [f"Failed to read JSON: {e}"]

    if not isinstance(data, dict):
        return ["Top-level JSON must be an object"]

    name = data.get("name")
    if not isinstance(name, str) or not name.strip():
        errors.append("Missing or invalid top-level 'name' (must be a non-empty string)")

    user_stories = data.get("userStories")
    if not isinstance(user_stories, list):
        errors.append("Missing or invalid 'userStories' (must be a list)")
        return errors

    if len(user_stories) == 0:
        errors.append("'userStories' must contain at least 1 story")
        return errors

    ids: set[str] = set()
    for index, story in enumerate(user_stories):
        label = f"userStories[{index}]"
        if not isinstance(story, dict):
            errors.append(f"{label} must be an object")
            continue

        story_id = story.get("id")
        if not isinstance(story_id, str) or not story_id.strip():
            errors.append(f"{label}.id is required and must be a non-empty string")
            continue

        _validate_story_id_is_unique(errors, ids, story_id, label)

        title = story.get("title")
        if not isinstance(title, str) or not title.strip():
            errors.append(f"{label}.title is required and must be a non-empty string")

        description = story.get("description")
        if description is not None and not isinstance(description, str):
            errors.append(f"{label}.description must be a string when present")

        acceptance_criteria = story.get("acceptanceCriteria")
        if not isinstance(acceptance_criteria, list) or not all(isinstance(c, str) and c.strip() for c in acceptance_criteria):
            errors.append(f"{label}.acceptanceCriteria is required and must be a list of non-empty strings")
        elif len(acceptance_criteria) == 0:
            errors.append(f"{label}.acceptanceCriteria must not be empty")

        verification_command = story.get("verificationCommand")
        if not isinstance(verification_command, str):
            errors.append(f"{label}.verificationCommand is required and must be a string (can be empty)")

        priority = story.get("priority")
        if not isinstance(priority, (int, float)):
            errors.append(f"{label}.priority is required and must be a number")

        passes = story.get("passes")
        if not isinstance(passes, bool):
            errors.append(f"{label}.passes is required and must be a boolean")

        attempts = story.get("attempts")
        if not isinstance(attempts, int) or attempts < 0:
            errors.append(f"{label}.attempts is required and must be an integer >= 0")

        blocked = story.get("blocked")
        if not isinstance(blocked, bool):
            errors.append(f"{label}.blocked is required and must be a boolean")

        blocked_reason = story.get("blockedReason")
        if not isinstance(blocked_reason, str):
            errors.append(f"{label}.blockedReason is required and must be a string")

        files = story.get("files")
        if not isinstance(files, list) or not all(isinstance(p, str) and p.strip() for p in files):
            errors.append(f"{label}.files is required and must be a list of non-empty strings (can be empty)")

        depends_on = story.get("dependsOn")
        if depends_on is not None:
            if not isinstance(depends_on, list) or not all(isinstance(d, str) and d.strip() for d in depends_on):
                errors.append(f"{label}.dependsOn must be a list of non-empty strings when present")

        phase = story.get("phase")
        if phase is not None:
            if not isinstance(phase, dict):
                errors.append(f"{label}.phase must be an object when present")
            else:
                phase_id = phase.get("id")
                phase_title = phase.get("title")
                if not isinstance(phase_id, str) or not phase_id.strip():
                    errors.append(f"{label}.phase.id is required and must be a non-empty string")
                if not isinstance(phase_title, str) or not phase_title.strip():
                    errors.append(f"{label}.phase.title is required and must be a non-empty string")

        if isinstance(passes, bool) and isinstance(blocked, bool) and isinstance(blocked_reason, str):
            if passes and blocked:
                errors.append(f"{label}: if passes=true then blocked must be false")
            if blocked:
                if passes:
                    errors.append(f"{label}: if blocked=true then passes must be false")
                if not blocked_reason.strip():
                    errors.append(f"{label}: if blocked=true then blockedReason must be non-empty")

    if ids:
        for index, story in enumerate(user_stories):
            if not isinstance(story, dict):
                continue
            depends_on = story.get("dependsOn")
            if depends_on is None:
                continue
            for dep in depends_on:
                if dep not in ids:
                    errors.append(f"userStories[{index}].dependsOn references unknown story id '{dep}'")

    return errors


def validate_prd(filepath: str) -> list[str]:
    """Validate PRD JSON file. Returns list of errors."""
    if not filepath.endswith(".json"):
        return ["PRD must be JSON (.json)."]
    return validate_prd_json(filepath)


def main():
    if len(sys.argv) < 2:
        print("Usage: validate_prd.py <prd.json>")
        sys.exit(1)

    filepath = sys.argv[1]

    try:
        errors = validate_prd(filepath)
    except FileNotFoundError:
        print(f"ERROR: File not found: {filepath}")
        sys.exit(1)
    except Exception as e:
        print(f"ERROR: {e}")
        sys.exit(1)

    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        sys.exit(1)

    print("PRD valid")
    sys.exit(0)


if __name__ == "__main__":
    main()
