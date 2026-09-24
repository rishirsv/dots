export const kit = "report";

export default ({ page, section, readingColumn, callout, comparison, table, recommendation }) =>
  page({
    title: "Choose one release proof boundary",
    context: "sample / decision comparison",
    dek: "Three approaches reduce duplicate release work. Only one preserves a literal chain from verification to publication.",
    footer: "Illustrative reference: replace all sample claims, dates, metrics, paths, and decisions with grounded source material.",
    layout: "wide",
  }, [
    readingColumn([
      section("frame", "The decision", [
        "Choose the smallest release architecture that proves the exact candidate once, then passes that same artifact to packaging and upload. This is illustrative content; replace every claim with evidence from the real system.",
        callout.note("Non-negotiable.", "A successful source build is not proof of a separately reconstructed upload candidate."),
      ]),
    ]),
    section("options", "Three viable approaches", [
      comparison([
        { title: "Keep separate gates", body: "Each release stage builds its own artifact. Familiar, but no single receipt identifies what shipped.", bestFor: "disposable development builds" },
        { title: "Freeze one candidate", body: "Build once, verify the immutable candidate, then package and upload that exact path.", bestFor: "releases that need auditable proof", recommended: true },
        { title: "Trust remote CI", body: "Publish after external checks report green. Simple locally, but the remote result still needs an artifact identity contract.", bestFor: "mature artifact-producing CI" },
      ]),
    ]),
    section("criteria", "Shared criteria expose the real tradeoff", [
      table({
        columns: ["Criterion", "Separate gates", "Frozen candidate", "Remote CI"],
        rows: [
          ["Candidate identity", "Changes by stage", "Stable end to end", "Depends on CI contract"],
          ["Duplicate work", "High", "Low", "Low locally"],
          ["Failure receipt", "Fragmented", "One local chain", "Split across systems"],
          ["Operational change", "None", "Contained", "Broad"],
        ],
      }),
    ]),
    readingColumn([
      section("tradeoff", "The cost worth accepting", [
        "The frozen candidate approach adds explicit artifact ownership to the release path. That is a real change, but it is smaller than importing a new CI architecture and directly closes the proof gap.",
      ]),
      section("recommendation", "Recommendation", [
        recommendation(
          "Freeze one candidate and make every later stage consume it.",
          "Record the candidate identifier, focused verification results, and publication receipt in one release summary.",
          "Do not widen this work into a build-system rewrite; preserve the existing build command and change only artifact handoff.",
        ),
      ]),
    ]),
  ]);
