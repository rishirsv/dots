"""Skill-specific adapters for the Autoresearch Run Review generator."""

from . import autoresearch, skill_autoresearch  # noqa: F401

REGISTRY = {
    autoresearch.SKILL_NAME: autoresearch,
    skill_autoresearch.SKILL_NAME: skill_autoresearch,
}


def get(skill_name):
    if skill_name not in REGISTRY:
        raise KeyError(
            "No adapter registered for skill '%s'. Known: %s"
            % (skill_name, sorted(REGISTRY.keys()))
        )
    return REGISTRY[skill_name]
