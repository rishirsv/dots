"""Run artifact record builders."""


def candidate_source(candidate):
    return {
        "candidate": candidate.get("candidate"),
        "display": candidate.get("display"),
        "source_kind": candidate.get("source_kind"),
        "source_ref": candidate.get("source_ref"),
        "resolved_source_path": candidate.get("resolved_source_path"),
        "worktree": candidate.get("worktree"),
        "base_commit": candidate.get("base_commit") or candidate.get("commit"),
        "head_commit": candidate.get("head_commit") or candidate.get("commit"),
        "dirty": candidate.get("dirty"),
        "diffstat": candidate.get("diffstat", ""),
        "payload_digest": candidate.get("payload_digest"),
        "validation_result": candidate.get("validation_result"),
    }


def trial_record(
    *,
    trial_id,
    case_id,
    candidate,
    repetition,
    status,
    cwd=None,
    thread_id=None,
    turn_id=None,
    thread_persistence=None,
    sandbox=None,
    runtime_approval_policy=None,
    sdk_version=None,
    runtime_version=None,
    events_path=None,
    evidence_path=None,
    response_path=None,
    usage=None,
    error=None,
):
    return {
        "trial_id": trial_id,
        "case_id": case_id,
        "candidate": candidate,
        "repetition": repetition,
        "runtime_status": status,
        "thread_id": thread_id,
        "turn_id": turn_id,
        "thread_persistence": thread_persistence,
        "cwd": cwd,
        "sandbox": sandbox,
        "runtime_approval_policy": runtime_approval_policy,
        "sdk_version": sdk_version,
        "runtime_version": runtime_version,
        "events_path": events_path,
        "evidence_path": evidence_path,
        "response_path": response_path,
        "usage": usage,
        "error": error,
    }


def thread_evidence(
    *,
    trial_id,
    thread_id=None,
    turn_id=None,
    thread_persistence=None,
    response_text=None,
    final_source="none",
    items_count=0,
    usage=None,
    status=None,
    warnings=None,
    sdk_version=None,
    runtime_version=None,
):
    return {
        "trial_id": trial_id,
        "thread_id": thread_id,
        "turn_id": turn_id,
        "thread_persistence": thread_persistence,
        "response_text": response_text,
        "final_source": final_source,
        "items_count": items_count,
        "usage": usage,
        "status": status,
        "warnings": warnings or [],
        "sdk_version": sdk_version,
        "runtime_version": runtime_version,
    }
