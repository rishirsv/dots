export const kit = "report";

export default ({ page, section, stats, timeline, callout, recommendation }) =>
  page({
    title: "Release workflow is one boundary from ready",
    context: "sample / status report",
    dek: "The duplicated validation path is removed. One owner decision remains before the release path can be exercised end to end.",
    footer: "Illustrative reference: replace all sample claims, dates, metrics, paths, and decisions with grounded source material.",
  }, [
    section("movement", "Why this week matters", [
      "The workflow now creates one candidate and preserves its identity through focused verification. This changes the release from a series of plausible green checks into a chain that can identify what ships.",
    ]),
    stats([
      { value: "1", label: "candidate per release", note: "was 3 rebuilds" },
      { value: "7m", label: "focused gate", note: "fixture timing" },
      { value: "1", label: "owner decision open" },
      { value: "0", label: "production releases run", note: "not yet verified" },
    ]),
    section("workstreams", "Workstreams", [
      timeline([
        { title: "Candidate identity contract", date: "complete", detail: "Build, verify, and publish now accept the same immutable reference." },
        { title: "Focused validation", date: "complete", detail: "Deterministic source and archive checks pass on the fixture candidate." },
        { title: "Publication ownership", date: "decision", detail: "Choose whether the release owner or CI service creates the external upload receipt.", state: "current" },
      ]),
    ]),
    section("risk", "Current constraint", [
      callout.warn("Not yet release proof.", "The fixture validates the contract, but no production credentialed upload has exercised the final handoff."),
    ]),
    section("next", "Next action", [
      recommendation(
        "Assign the external upload receipt to the release owner and run one non-production candidate through the full path.",
        "That closes the only ownership ambiguity without redesigning CI.",
      ),
    ]),
  ]);
