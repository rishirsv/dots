"""App Server event capture and final-response folding."""

import json

from ..io import normalize_usage, to_jsonable


def fold_events(turn, generated, event_path):
    agent_message = getattr(generated, "AgentMessageThreadItem", None)
    item_completed = getattr(generated, "ItemCompletedNotification")
    message_phase = getattr(generated, "MessagePhase", None)
    token_usage = getattr(generated, "ThreadTokenUsageUpdatedNotification", None)
    turn_completed = getattr(generated, "TurnCompletedNotification")

    completed = None
    usage = None
    final_response = None
    unknown_phase_response = None
    event_count = 0
    event_path.parent.mkdir(parents=True, exist_ok=True)
    with event_path.open("w", encoding="utf-8") as fh:
        for event in turn.stream():
            event_count += 1
            fh.write(json.dumps({"method": event.method, "payload": to_jsonable(event.payload)}, sort_keys=True) + "\n")
            payload = event.payload
            if isinstance(payload, item_completed) and payload.turn_id == turn.id:
                item = payload.item.root if hasattr(payload.item, "root") else payload.item
                if agent_message is not None and isinstance(item, agent_message) and isinstance(item.text, str):
                    final_answer = getattr(message_phase, "final_answer", None)
                    if item.phase == final_answer:
                        final_response = item.text
                    elif item.phase is None and unknown_phase_response is None:
                        unknown_phase_response = item.text
            elif token_usage is not None and isinstance(payload, token_usage) and payload.turn_id == turn.id:
                usage = payload.token_usage
            elif isinstance(payload, turn_completed) and payload.turn.id == turn.id:
                completed = payload.turn
    return {
        "completed": completed,
        "usage": normalize_usage(usage),
        "final_response": final_response if final_response is not None else unknown_phase_response or "",
        "event_count": event_count,
    }

