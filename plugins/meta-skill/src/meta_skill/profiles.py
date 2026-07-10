"""Embedded eval run profiles."""

from .errors import CliError
from .manifest import select_cases


def load_profile(manifest, profile_id):
    if not profile_id:
        return None
    profile = (manifest.get("profiles") or {}).get(profile_id)
    if profile is None:
        raise CliError(f"profile not found in evals.json: {profile_id}", 2)
    return {"id": profile_id, **profile}


def apply_profile(args, manifest, profile_id):
    profile = load_profile(manifest, profile_id)
    if profile is None:
        return None
    if profile.get("case_ids"):
        args.case = list(profile["case_ids"])
    if profile.get("types"):
        args.type = list(profile["types"])
    if profile.get("split"):
        args.split = profile["split"]
    if profile.get("candidates"):
        args.candidates = ",".join(profile["candidates"])
    args.profile_default_repetitions = (profile.get("repetitions") or {}).get("default")
    args.repetitions_by_type = {
        key: value for key, value in (profile.get("repetitions") or {}).items() if key != "default"
    }
    return profile


def profile_case_ids(manifest, profile):
    if not profile:
        return [case.get("id") for case in manifest.get("evals", [])]
    cases = select_cases(
        manifest,
        profile.get("split"),
        case_ids=profile.get("case_ids"),
        case_types=profile.get("types"),
    )
    return [case.get("id") for case in cases]
