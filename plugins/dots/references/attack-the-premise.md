# Attack the premise

Use this procedure when two or more fixes that share one premise have failed
the same check and the symptom is uneven work or resource distribution between
actors, such as workers or queues.

1. **Write the premise down.** The premise is the one sentence that every
   failed fix assumed.
2. **Take a census before the next fix.** Count the imbalance per actor. The
   census shows which actors hold the imbalance, not just how large it is.
   Write the census as a rerunnable script.
3. **Read the skew.** If the same few actors hold most of the imbalance on
   every run, investigate what assigns them that role. Test whether that
   assignment causes the imbalance.
4. **Remove the asymmetry instead of compensating for it** when the assignment
   is the cause. Rotate the role between actors, randomize the assignment, or
   move the role, so that no actor holds it on every run, where the required
   ordering and ownership allow it. A return path, a shared pool, a batched
   hand-off, or a periodic rebalance may leave the assignment in place and add
   work on every run.
5. Repeat the census and the original check after the change. Keep a fix only
   when it improves the target without violating its guardrails.

Do not start the next fix before the premise is written down and the census
exists. If the census is even across actors, that result weakens the persistent
assignment explanation. Keep it as evidence and test other causes; it does
not by itself disprove every assumption behind the failed fixes.

Adapted from [pstack 0.15.0's Attack the Premise](https://github.com/cursor/plugins/blob/71ed0d1076fec562c1b74ee353121a8d00f75382/pstack/skills/principle-attack-the-premise/SKILL.md).
