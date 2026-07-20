import { useEffect, useMemo, useRef, useState } from "react";
import { Button, TextArea } from "@radix-ui/themes";
import { post, request } from "./api";
import type {
  Annotation,
  Artifact,
  CasePacket,
  Grade,
  RunReport,
  RunSummary,
  SkillSummary,
  TrialPacket,
} from "./types";

const DIAGNOSES = [
  ["candidate-failure", "Skill method", "The skill needs a reusable method or instruction change."],
  ["routing-failure", "Routing or description", "The skill should have been selected differently."],
  ["task-defect", "Case definition", "The task or expected behavior is wrong or unclear."],
  ["grader-defect", "Judge or rubric", "The grader judged the wrong thing."],
  ["harness-error", "Runner or harness", "Execution did not represent the intended environment."],
  ["environment-failure", "Environment", "A required tool, dependency, or permission was unavailable."],
  ["model-variance", "Model variance", "Repeat the same evidence before changing the skill."],
  ["expected-change", "Expected change", "The difference is intentional."],
  ["taste-rule", "Reusable taste rule", "Capture a general quality preference."],
  ["one-off", "One-off note", "Useful context that should not become a rule."],
] as const;

type View = "runs" | "run" | "case";

interface RouteState {
  skill: string | null;
  run: string | null;
  caseId: string | null;
  candidate: string | null;
  repetition: number | null;
  filter: "attention" | "all";
}

function routeState(): RouteState {
  const query = new URLSearchParams(location.search);
  return {
    skill: query.get("skill"),
    run: query.get("run"),
    caseId: query.get("case"),
    candidate: query.get("candidate"),
    repetition: Number(query.get("repetition")) || null,
    filter: query.get("filter") === "all" ? "all" : "attention",
  };
}

function statusClass(value?: string | null): string {
  return `status status-${value || "unknown"}`;
}

function durationText(value?: number | null): string {
  if (typeof value !== "number" || value <= 0) return "duration unknown";
  const totalSeconds = Math.round(value / 1000);
  if (totalSeconds < 60) return `${(value / 1000).toFixed(1)}s`;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return hours
    ? `${hours}h ${String(minutes).padStart(2, "0")}m`
    : `${minutes}m ${String(seconds).padStart(2, "0")}s`;
}

function tokenText(value?: number | null): string {
  if (typeof value !== "number" || value <= 0) return "tokens unknown";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 1 : 2).replace(/\.0+$/, "")}M tokens`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(value >= 100_000 ? 0 : 1).replace(/\.0$/, "")}K tokens`;
  return `${value.toLocaleString()} tokens`;
}

function bytes(value: number): string {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(value < 10240 ? 1 : 0)} KB`;
  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

function candidateRows(run: RunReport): Array<{ candidate: string; display: string }> {
  return (run.candidates || []).map((candidate) =>
    typeof candidate === "string"
      ? { candidate, display: candidate }
      : { candidate: candidate.candidate, display: candidate.display || candidate.candidate },
  );
}

function runNeedsReview(run: RunSummary): boolean {
  const lifecycle = run.lifecycle || {};
  return Boolean(
    run.needs_review ||
      lifecycle.status !== "completed" ||
      run.pending_human_review ||
      run.runtime_status_totals?.failed ||
      run.runtime_status_totals?.timed_out ||
      (run.delta_totals?.case_regression || 0) + (run.delta_totals?.observed_regression || 0),
  );
}

function runResult(run: RunSummary): string {
  const lifecycle = run.lifecycle || {};
  if (lifecycle.status && lifecycle.status !== "completed") return `${lifecycle.status} · ${lifecycle.phase || ""}`;
  if (run.runtime_status_totals?.failed || run.runtime_status_totals?.timed_out) return "runtime error";
  if (run.pending_human_review) return `${run.pending_human_review} awaiting human review`;
  const regressions = (run.delta_totals?.case_regression || 0) + (run.delta_totals?.observed_regression || 0);
  if (regressions) return `${regressions} regression${regressions === 1 ? "" : "s"}`;
  return `${run.totals?.passed || 0} pass · ${run.totals?.failed || 0} fail · ${run.totals?.inconclusive || 0} inconclusive`;
}

function executionPlan(run: RunSummary): string {
  const plan = run.plan || {};
  const executions = plan.executions_per_case;
  return executions
    ? `${plan.cases}×${plan.candidates}×${executions} = ${plan.trials}`
    : `${plan.trials || run.totals?.trials || 0} executions`;
}

function casePriority(run: RunReport, evalId: string): number {
  const row = run.cases?.find((item) => item.eval_id === evalId);
  const trials = row?.versions.flatMap((version) => version.trials) || [];
  if (trials.some((trial) => ["failed", "timed_out", "cancelled"].includes(trial.status))) return 0;
  if (trials.some((trial) => run.trials?.find((item) => item.trial_id === trial.trial_id)?.human_review_pending)) return 1;
  const delta = run.comparisons?.find((item) => item.eval_id === evalId)?.delta;
  if (delta === "case_regression" || delta === "observed_regression") return 2;
  if (trials.some((trial) => ["failed", "inconclusive", "ungraded"].includes(trial.verdict))) return 3;
  return 4;
}

function Icon({ name }: { name: "chevron" | "file" | "back" | "forward" | "pin" }) {
  const paths = {
    chevron: <path d="m9 18 6-6-6-6" />,
    file: <><path d="M5 3h10l4 4v14H5z" /><path d="M15 3v5h5M8 12h8M8 16h8" /></>,
    back: <path d="m15 18-6-6 6-6M9 12h10" />,
    forward: <path d="m9 18 6-6-6-6M15 12H5" />,
    pin: <><path d="m9 3 6 1-1 6 3 3-5 1-1 7-2-7-5-1 3-3z" /></>,
  };
  return <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function Status({ value }: { value?: string | null }) {
  return <span className={statusClass(value)}>{value || "unknown"}</span>;
}

function Loading({ label = "Loading workbench…" }: { label?: string }) {
  return <div className="loading" role="status"><span className="spinner" />{label}</div>;
}

function ErrorPanel({ message, retry }: { message: string; retry: () => void }) {
  return <div className="error-panel" role="alert"><strong>Could not load this view.</strong><p>{message}</p><button onClick={retry}>Retry</button></div>;
}

function SkillRail({ skills, selected, onSelect }: { skills: SkillSummary[]; selected: string | null; onSelect: (skill: SkillSummary) => void }) {
  return <aside className="skill-rail">
    <h2>Skills</h2>
    <div className="skill-list">
      {skills.map((skill) => <button key={skill.id} className={selected === skill.id ? "skill-row active" : "skill-row"} onClick={() => onSelect(skill)}>
        <span><strong>{skill.name}</strong><small>{skill.id}</small></span>
        <span className="skill-count">{skill.eval_count}c · {skill.run_count}r</span>
        <Icon name="chevron" />
      </button>)}
    </div>
  </aside>;
}

function ProductBar({ root, status }: { root: string; status: string }) {
  return <header className="product-bar"><strong>MetaSkill</strong><span className="root-path">{root}</span><span className="ready"><i />{status}</span></header>;
}

export function App() {
  const initial = useMemo(routeState, []);
  const [root, setRoot] = useState("");
  const [skills, setSkills] = useState<SkillSummary[]>([]);
  const [skill, setSkill] = useState<SkillSummary | null>(null);
  const [runs, setRuns] = useState<RunSummary[]>([]);
  const [run, setRun] = useState<RunReport | null>(null);
  const [casePacket, setCasePacket] = useState<CasePacket | null>(null);
  const [view, setView] = useState<View>("runs");
  const [filter, setFilter] = useState<RouteState["filter"]>(initial.filter);
  const [status, setStatus] = useState("Loading");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const syncUrl = (next: { skill?: SkillSummary | null; run?: RunReport | null; casePacket?: CasePacket | null; candidate?: string | null; repetition?: number | null; filter?: RouteState["filter"] }, push = false) => {
    const selectedSkill = next.skill === undefined ? skill : next.skill;
    const selectedRun = next.run === undefined ? run : next.run;
    const selectedCase = next.casePacket === undefined ? casePacket : next.casePacket;
    const query = new URLSearchParams();
    if (selectedSkill) query.set("skill", selectedSkill.id);
    query.set("tab", "runs");
    if (selectedRun) query.set("run", selectedRun.run_id);
    if (selectedCase) query.set("case", selectedCase.eval_id);
    if (next.candidate) query.set("candidate", next.candidate);
    if (next.repetition) query.set("repetition", String(next.repetition));
    query.set("filter", next.filter || filter);
    history[push ? "pushState" : "replaceState"]({}, "", `${location.pathname}?${query}`);
  };

  const fetchRuns = async (selected: SkillSummary) => {
    const payload = await request<{ runs: RunSummary[] }>(`/api/skills/${encodeURIComponent(selected.id)}/runs`);
    setRuns(payload.runs);
    return payload.runs;
  };

  const fetchRun = async (selected: SkillSummary, id: string) =>
    request<RunReport>(`/api/runs/${encodeURIComponent(id)}?skill=${encodeURIComponent(selected.id)}`);

  const fetchCase = async (selected: SkillSummary, selectedRun: RunReport, id: string) =>
    request<CasePacket>(`/api/runs/${encodeURIComponent(selectedRun.run_id)}/cases/${encodeURIComponent(id)}?skill=${encodeURIComponent(selected.id)}`);

  const bootstrap = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await request<{ root: string; skills: SkillSummary[] }>("/api/skills");
      const available = payload.skills.filter((row) => row.suite_ready || row.run_count);
      const selected = available.find((row) => row.id === initial.skill) || available.find((row) => row.run_count) || available[0] || null;
      setRoot(payload.root);
      setSkills(available);
      setSkill(selected);
      if (selected) {
        await fetchRuns(selected);
        if (initial.run) {
          const report = await fetchRun(selected, initial.run);
          setRun(report);
          setView("run");
          if (initial.caseId) {
            const packet = await fetchCase(selected, report, initial.caseId);
            setCasePacket(packet);
            setView("case");
          }
        }
      }
      setStatus("Ready");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
      setStatus("Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void bootstrap();
    const reload = () => location.reload();
    addEventListener("popstate", reload);
    return () => removeEventListener("popstate", reload);
  }, []);

  const selectSkill = async (selected: SkillSummary) => {
    setLoading(true);
    setError(null);
    try {
      setSkill(selected);
      setRun(null);
      setCasePacket(null);
      setView("runs");
      await fetchRuns(selected);
      syncUrl({ skill: selected, run: null, casePacket: null }, true);
      setStatus("Ready");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setLoading(false);
    }
  };

  const openRun = async (id: string, push = true) => {
    if (!skill) return;
    setLoading(true);
    setError(null);
    try {
      const report = await fetchRun(skill, id);
      setRun(report);
      setCasePacket(null);
      setView("run");
      syncUrl({ run: report, casePacket: null }, push);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setLoading(false);
    }
  };

  const openCase = async (id: string, candidate?: string, repetition?: number, push = true) => {
    if (!skill || !run) return;
    setLoading(true);
    setError(null);
    try {
      const packet = await fetchCase(skill, run, id);
      setCasePacket(packet);
      setView("case");
      syncUrl({ casePacket: packet, candidate, repetition }, push);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setLoading(false);
    }
  };

  const refreshCase = async () => {
    if (!skill || !run || !casePacket) return;
    const packet = await fetchCase(skill, run, casePacket.eval_id);
    setCasePacket(packet);
  };

  const body = error
    ? <ErrorPanel message={error} retry={() => void bootstrap()} />
    : loading
      ? <Loading />
      : !skill
        ? <div className="empty">No evaluated skills found.</div>
        : view === "case" && run && casePacket
          ? <CaseReview skill={skill} run={run} packet={casePacket} initial={initial} onBack={() => { setCasePacket(null); setView("run"); syncUrl({ casePacket: null }, true); }} onNavigate={(id) => void openCase(id)} onRefresh={() => void refreshCase()} />
          : view === "run" && run
            ? <RunOverview run={run} filter={filter} onFilter={(next) => { setFilter(next); syncUrl({ filter: next }); }} onBack={() => { setRun(null); setView("runs"); syncUrl({ run: null, casePacket: null }, true); }} onOpenCase={(id, candidate, repetition) => void openCase(id, candidate, repetition)} />
            : <RunList runs={runs} filter={filter} skill={skill} onFilter={(next) => { setFilter(next); syncUrl({ filter: next }); }} onOpen={(id) => void openRun(id)} />;

  return <div className={`app-shell ${view === "case" ? "case-mode" : ""}`}>
    <ProductBar root={root} status={status} />
    <SkillRail skills={skills} selected={skill?.id || null} onSelect={(selected) => void selectSkill(selected)} />
    <main className={view === "case" ? "workspace case-workspace" : "workspace"}>{body}</main>
  </div>;
}

function RunList({ runs, filter, skill, onFilter, onOpen }: { runs: RunSummary[]; filter: RouteState["filter"]; skill: SkillSummary; onFilter: (value: RouteState["filter"]) => void; onOpen: (id: string) => void }) {
  const rows = runs.filter((run) => filter === "all" || runNeedsReview(run));
  return <section className="run-list-view">
    <div className="view-heading"><div><h1>{skill.name}</h1><p>{skill.description}</p></div><label>Show<select value={filter} onChange={(event) => onFilter(event.target.value as RouteState["filter"])}><option value="attention">Needs review</option><option value="all">All runs</option></select></label></div>
    <div className="section-title"><h2>Runs</h2><span>Immutable evidence, newest first.</span></div>
    {runs.length === 0 ? <div className="empty">No runs yet. Ask the agent to evaluate this skill, then refresh.</div> : <div className="run-table-wrap"><table className="run-table"><thead><tr><th>Run</th><th>Plan</th><th>Versions</th><th>Result</th><th>Reviewed</th></tr></thead><tbody>
      {rows.map((run) => <tr key={run.run_id}><td><a href={`?skill=${encodeURIComponent(skill.id)}&tab=runs&run=${encodeURIComponent(run.run_id)}&filter=${filter}`} onClick={(event) => { event.preventDefault(); onOpen(run.run_id); }}>{run.objective && <strong>{run.objective}</strong>}<code>{run.run_id}</code><small>{run.created_at || ""}</small></a></td><td>{executionPlan(run)}</td><td>{(run.candidates || []).map((candidate) => typeof candidate === "string" ? candidate : candidate.candidate).join(" · ")}</td><td>{runResult(run)}</td><td>{run.review?.reviewed || 0}/{run.review?.total || 0}</td></tr>)}
      {rows.length === 0 && <tr><td colSpan={5}>No runs need review.</td></tr>}
    </tbody></table></div>}
  </section>;
}

function RunOverview({ run, filter, onFilter, onBack, onOpenCase }: { run: RunReport; filter: RouteState["filter"]; onFilter: (value: RouteState["filter"]) => void; onBack: () => void; onOpenCase: (id: string, candidate?: string, repetition?: number) => void }) {
  const lifecycle = run.lifecycle || {};
  const candidates = candidateRows(run);
  const rows = [...(run.cases || [])].sort((a, b) => casePriority(run, a.eval_id) - casePriority(run, b.eval_id) || a.eval_id.localeCompare(b.eval_id)).filter((row) => filter === "all" || casePriority(run, row.eval_id) < 4);
  return <section className="run-overview">
    <button className="back-button" onClick={onBack}><Icon name="back" />Runs</button>
    <div className="run-heading"><div><h1>{run.objective || "Version comparison"}</h1><code>{run.run_id}</code></div><div className="run-lifecycle"><Status value={String(lifecycle.status || "completed")} /><span>{String(lifecycle.phase || "finished")}</span></div></div>
    <div className="run-metrics"><div><strong>{run.cases?.length || 0}</strong><span>cases</span></div><div><strong>{candidates.length}</strong><span>candidates</span></div><div><strong>{run.totals?.trials || 0}</strong><span>executions</span></div><div><strong>{run.review?.reviewed || 0}/{run.review?.total || 0}</strong><span>reviewed</span></div></div>
    <div className="matrix-toolbar"><span>Runtime errors and blind human reviews appear first.</span><label>Show<select value={filter} onChange={(event) => onFilter(event.target.value as RouteState["filter"])}><option value="attention">Needs attention</option><option value="all">All cases</option></select></label></div>
    {run.planning_error ? <div className="error-panel">{run.planning_error}</div> : <div className="matrix-wrap"><table className="case-matrix"><thead><tr><th>Case</th>{candidates.map((candidate) => <th key={candidate.candidate}>{candidate.display}</th>)}</tr></thead><tbody>
      {rows.map((row) => <tr key={row.eval_id}><td><button onClick={() => onOpenCase(row.eval_id)}>{row.eval_id}</button></td>{candidates.map((candidate) => { const version = row.versions.find((item) => item.candidate === candidate.candidate); const pending = version?.trials.some((trial) => run.trials?.find((item) => item.trial_id === trial.trial_id)?.human_review_pending); return <td key={candidate.candidate}>{version ? <button onClick={() => onOpenCase(row.eval_id, candidate.candidate, version.trials[0]?.repetition)}><Status value={pending ? "inconclusive" : version.verdict} />{pending && <small>Human review needed</small>}</button> : "—"}</td>; })}</tr>)}
      {rows.length === 0 && <tr><td colSpan={candidates.length + 1}>No cases need attention.</td></tr>}
    </tbody></table></div>}
    <details className="provenance"><summary>Exact run provenance</summary><dl><dt>Task executor</dt><dd>{executorText(run.task_executor)}</dd><dt>Judge executor</dt><dd>{executorText(run.judge_executor)}</dd><dt>Baseline</dt><dd>{run.baseline_candidate || "none"}</dd><dt>Usage</dt><dd>{tokenText(run.token_usage?.total_tokens)}</dd><dt>Elapsed</dt><dd>{durationText(run.duration_ms)}</dd><dt>Suite digest</dt><dd><code>{run.suite_digest || "unknown"}</code></dd></dl></details>
  </section>;
}

function executorText(value?: Record<string, unknown> | null): string {
  if (!value) return "unknown";
  return [value.kind, value.observed_model || value.requested_model, value.requested_reasoning].filter(Boolean).join(" · ") || "unknown";
}

function CaseReview({ skill, run, packet, initial, onBack, onNavigate, onRefresh }: { skill: SkillSummary; run: RunReport; packet: CasePacket; initial: RouteState; onBack: () => void; onNavigate: (id: string) => void; onRefresh: () => void }) {
  const groups = useMemo(() => {
    const grouped = new Map<string, TrialPacket[]>();
    packet.trials.forEach((trial) => grouped.set(trial.trial.candidate, [...(grouped.get(trial.trial.candidate) || []), trial]));
    return grouped;
  }, [packet]);
  const [repetitions, setRepetitions] = useState<Record<string, number>>(() => Object.fromEntries([...groups].map(([candidate, trials]) => [candidate, initial.candidate === candidate && initial.repetition ? initial.repetition : trials[0].trial.repetition])));
  const selectedPackets = [...groups].map(([candidate, trials]) => trials.find((trial) => trial.trial.repetition === repetitions[candidate]) || trials[0]);
  const [selectedTrialId, setSelectedTrialId] = useState(() => selectedPackets.find((trial) => trial.trial.candidate === initial.candidate)?.trial.trial_id || selectedPackets[0]?.trial.trial_id || "");
  const selected = packet.trials.find((trial) => trial.trial.trial_id === selectedTrialId) || selectedPackets[0];
  const caseRows = [...(run.cases || [])].sort((a, b) => casePriority(run, a.eval_id) - casePriority(run, b.eval_id) || a.eval_id.localeCompare(b.eval_id));
  const index = caseRows.findIndex((row) => row.eval_id === packet.eval_id);
  const previous = caseRows[index - 1];
  const next = caseRows[index + 1];
  const [reveals, setReveals] = useState<Record<string, { grades: Grade[]; disagreements: Array<{ metric: string; human: string; model: string }> }>>({});
  const [reviewOpen, setReviewOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const compareTrigger = useRef<HTMLButtonElement | null>(null);
  const blindPending = Boolean(selected?.review_blind_pending || (selected?.human_grader && !selected.human_recorded));
  const comparable = selectedPackets.flatMap((trial) => {
    const artifact = trial.artifacts.find((row) => row.rendered_previews?.length);
    return artifact?.rendered_previews?.length ? [{ trialId: trial.trial.trial_id, candidate: trial.candidate_display || trial.trial.candidate, artifact, previews: artifact.rendered_previews }] : [];
  });
  const closeCompare = (focusInspector: boolean) => {
    setCompareOpen(false);
    if (focusInspector) {
      if (matchMedia("(max-width: 820px)").matches) setReviewOpen(true);
      setTimeout(() => document.querySelector<HTMLSelectElement>(".review-inspector select")?.focus(), 0);
    } else {
      setTimeout(() => compareTrigger.current?.focus(), 0);
    }
  };

  return <div className="case-layout">
    <header className="case-masthead"><div className="case-title"><Icon name="file" /><h1>{packet.eval_id}</h1></div><span>Case {index + 1} of {caseRows.length}</span><div className="case-nav"><button disabled={!previous} onClick={() => previous && onNavigate(previous.eval_id)}><Icon name="back" />Previous</button><button disabled={!next} onClick={() => next && onNavigate(next.eval_id)}>Next<Icon name="forward" /></button></div><div className="case-state"><span>{blindPending ? "Blind outcome: hidden" : <>Outcome: <Status value={selected?.trial.verdict} /></>}</span><span>Review: <Status value={selected?.review?.decision ? "reviewed" : "needs-review"} /></span></div></header>
    <section className="case-context"><details><summary><strong>Prompt</strong><span>{packet.task}</span></summary><div>{packet.task}</div></details><details><summary><strong>Expected behavior</strong><span>{packet.expectations[0] || "No explicit expectations."}</span></summary><ul>{packet.expectations.map((expectation) => <li key={expectation}>{expectation}</li>)}</ul></details>{comparable.length > 1 && <Button ref={compareTrigger} className="compare-trigger" variant="ghost" onClick={() => setCompareOpen(true)}>Compare rendered previews</Button>}</section>
    <section className="candidate-lanes">{selectedPackets.map((trial) => <CandidateLane key={trial.trial.trial_id} skill={skill} run={run} packet={trial} repetitions={groups.get(trial.trial.candidate) || []} selected={trial.trial.trial_id === selected?.trial.trial_id} revealed={reveals[trial.trial.trial_id]} onSelect={() => setSelectedTrialId(trial.trial.trial_id)} onRepetition={(value) => { setRepetitions((current) => ({ ...current, [trial.trial.candidate]: value })); const replacement = groups.get(trial.trial.candidate)?.find((row) => row.trial.repetition === value); if (replacement) setSelectedTrialId(replacement.trial.trial_id); }} onReveal={(value) => setReveals((current) => ({ ...current, [trial.trial.trial_id]: value }))} onRefresh={onRefresh} />)}</section>
    {selected && <ReviewInspector skill={skill} run={run} packet={selected} open={reviewOpen} onClose={() => setReviewOpen(false)} onRefresh={onRefresh} />}
    {selected && <button className="review-dock" onClick={() => setReviewOpen(true)}><span><strong>Review evidence</strong><small>{selected.candidate_display || selected.trial.candidate} · {selected.review?.decision ? "reviewed" : "decision needed"}</small></span><span>Open</span></button>}
    {compareOpen && <PreviewCompare items={comparable} selectedTrialId={selectedTrialId} onSelect={setSelectedTrialId} onClose={closeCompare} />}
    <footer className="case-footer"><button onClick={onBack}>Case matrix</button><span>Human grade is recorded before judge reveal.</span></footer>
  </div>;
}

function artifactUrl(skill: SkillSummary, run: RunReport, packet: TrialPacket, artifact: Artifact): string {
  const path = artifact.path.split("/").map(encodeURIComponent).join("/");
  return `/api/artifacts/${encodeURIComponent(packet.trial.trial_id)}/${path}?skill=${encodeURIComponent(skill.id)}&run=${encodeURIComponent(run.run_id)}`;
}

function interactiveArtifactUrl(skill: SkillSummary, run: RunReport, packet: TrialPacket, artifact: Artifact): string {
  const path = artifact.path.split("/").map(encodeURIComponent).join("/");
  return `/api/interactive/${encodeURIComponent(packet.trial.trial_id)}/${path}?skill=${encodeURIComponent(skill.id)}&run=${encodeURIComponent(run.run_id)}`;
}

function CandidateLane({ skill, run, packet, repetitions, selected, revealed, onSelect, onRepetition, onReveal, onRefresh }: { skill: SkillSummary; run: RunReport; packet: TrialPacket; repetitions: TrialPacket[]; selected: boolean; revealed?: { grades: Grade[]; disagreements: Array<{ metric: string; human: string; model: string }> }; onSelect: () => void; onRepetition: (value: number) => void; onReveal: (value: { grades: Grade[]; disagreements: Array<{ metric: string; human: string; model: string }> }) => void; onRefresh: () => void }) {
  const trial = packet.trial;
  const runtimeProblem = ["failed", "timed_out", "cancelled"].includes(trial.status) || Boolean(trial.error || trial.failed_checks?.length);
  const blindPending = Boolean(packet.review_blind_pending || (packet.human_grader && !packet.human_recorded));
  return <article className={`candidate-lane lane-${trial.candidate} ${selected ? "selected" : ""}`}>
    <header><Button className="lane-choice" variant="ghost" size="1" aria-pressed={selected} onClick={onSelect}><i /><span><strong>{packet.candidate_display || trial.candidate}</strong><small>{selected ? "Selected for review" : "Select for review"}</small></span></Button><div className="lane-meta"><span>{durationText(trial.duration_ms)}</span><span>{tokenText(trial.usage?.total_tokens)}</span><span>{repetitions.length === 1 ? "one execution" : `${repetitions.length} executions`}</span><span>{blindPending ? "Outcome hidden" : <>Outcome <Status value={trial.verdict} /></>}</span><span>Review <Status value={packet.review?.decision ? "reviewed" : "needs-review"} /></span></div>{repetitions.length > 1 && <label>Execution<select value={trial.repetition} onChange={(event) => onRepetition(Number(event.target.value))}>{repetitions.map((row) => <option key={row.trial.repetition} value={row.trial.repetition}>{row.trial.repetition}</option>)}</select></label>}</header>
    <section className={runtimeProblem ? "runtime runtime-error" : "runtime"}><strong>Runtime: {trial.status}</strong>{(trial.error || trial.stop_reason) && <p>{trial.error || trial.stop_reason}</p>}{trial.failed_checks?.map((check, index) => <p key={index}>{check.name || "Failed check"}: {check.evidence || check.note || check.label}</p>)}{packet.transcript?.items.length ? <details><summary>Execution transcript · {packet.transcript.shown}/{packet.transcript.total}</summary><ol>{packet.transcript.items.map((event, index) => <li key={index}><code>{event.method}</code>{event.text && ` — ${event.text}`}</li>)}</ol></details> : <span>No transcript recorded.</span>}</section>
    <div className="lane-section-label">Artifact evidence</div>
    <div className="artifact-stack">{packet.artifacts.length ? packet.artifacts.map((artifact) => <ArtifactCard key={artifact.path} skill={skill} run={run} packet={packet} artifact={artifact} />) : <p>No files were produced.</p>}</div>
    <div className="lane-section-label">Agent response</div><div className="agent-response">{packet.response || "No response recorded."}</div>
    <HumanReview skill={skill} run={run} packet={packet} revealed={revealed} onReveal={onReveal} onRefresh={onRefresh} />
    {!packet.human_grader && !blindPending && <details className="grade-disclosure"><summary>Grades <span>({packet.grades.length})</span></summary><GradeList grades={packet.grades} /></details>}
  </article>;
}

type PreviewFrame = NonNullable<Artifact["rendered_previews"]>[number];

function PreviewCompare({ items, selectedTrialId, onSelect, onClose }: { items: Array<{ trialId: string; candidate: string; artifact: Artifact; previews: PreviewFrame[] }>; selectedTrialId: string; onSelect: (trialId: string) => void; onClose: (focusInspector: boolean) => void }) {
  const [zoom, setZoom] = useState(.35);
  const [pageIndex, setPageIndex] = useState(0);
  const frames = items.map((item) => item.previews[Math.min(pageIndex, item.previews.length - 1)]);
  const frameCount = Math.max(...items.map((item) => item.previews.length));
  const sameDimensions = frames.every((frame) => frame.width === frames[0]?.width && frame.height === frames[0]?.height);
  const [linked, setLinked] = useState(sameDimensions);
  const [targetChanged, setTargetChanged] = useState(false);
  const dialog = useRef<HTMLDialogElement | null>(null);
  const closeButton = useRef<HTMLButtonElement | null>(null);
  const panes = useRef<Array<HTMLDivElement | null>>([]);
  const syncing = useRef(false);
  const fitWidth = () => {
    const ratios = frames.flatMap((frame, index) => {
      const pane = panes.current[index];
      return pane ? [pane.clientWidth / (frame.width || 1440)] : [];
    });
    if (ratios.length) setZoom(Math.max(.25, Math.min(1.25, Math.floor(Math.min(...ratios) * 20) / 20)));
  };
  useEffect(() => {
    dialog.current?.showModal();
    closeButton.current?.focus();
    requestAnimationFrame(fitWidth);
    return () => { if (dialog.current?.open) dialog.current.close(); };
  }, []);
  const syncScroll = (source: HTMLDivElement, sourceIndex: number) => {
    if (!linked || syncing.current) return;
    syncing.current = true;
    const x = source.scrollWidth > source.clientWidth ? source.scrollLeft / (source.scrollWidth - source.clientWidth) : 0;
    const y = source.scrollHeight > source.clientHeight ? source.scrollTop / (source.scrollHeight - source.clientHeight) : 0;
    panes.current.forEach((pane, index) => {
      if (!pane || index === sourceIndex) return;
      pane.scrollLeft = x * Math.max(0, pane.scrollWidth - pane.clientWidth);
      pane.scrollTop = y * Math.max(0, pane.scrollHeight - pane.clientHeight);
    });
    requestAnimationFrame(() => { syncing.current = false; });
  };
  const close = () => onClose(targetChanged);
  return <dialog ref={dialog} className="compare-overlay" aria-labelledby="compare-title" onCancel={(event) => { event.preventDefault(); close(); }}>
    <header><div><h2 id="compare-title">Compare rendered previews</h2><p>Inert harness captures · matching page {pageIndex + 1} · {linked ? "scroll linked" : "independent scrolling"}{!sameDimensions && " · dimensions differ"}</p></div><div className="compare-pages"><Button size="1" variant="surface" disabled={pageIndex === 0} onClick={() => setPageIndex((value) => value - 1)}>Previous page</Button><strong>{pageIndex + 1} / {frameCount}</strong><Button size="1" variant="surface" disabled={pageIndex >= frameCount - 1} onClick={() => setPageIndex((value) => value + 1)}>Next page</Button></div><Button className="link-toggle" size="1" variant="surface" aria-pressed={linked} onClick={() => setLinked((value) => !value)}>{linked ? "Unlink scroll" : "Link scroll"}</Button><Button className="fit-width" size="1" variant="surface" onClick={fitWidth}>Fit width</Button><label>Zoom <input type="range" min="0.25" max="1.25" step="0.05" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} /><output>{Math.round(zoom * 100)}%</output></label><Button ref={closeButton} size="2" variant="surface" onClick={close}>Close</Button></header>
    <div className="compare-grid">{items.map((item, index) => { const frame = frames[index]; return <section key={`${item.candidate}-${item.artifact.path}`}><h3><span><strong>{item.candidate}</strong><code>{frame.label || item.artifact.path}</code></span><Button className="compare-select" size="1" variant={item.trialId === selectedTrialId ? "solid" : "surface"} aria-pressed={item.trialId === selectedTrialId} onClick={() => { onSelect(item.trialId); setTargetChanged(true); }}>{item.trialId === selectedTrialId ? "Selected for review" : "Select for review"}</Button></h3><div className="compare-pane" ref={(node) => { panes.current[index] = node; }} onScroll={(event) => syncScroll(event.currentTarget, index)}><img src={frame.url} alt={`Page ${pageIndex + 1} inert preview for ${item.candidate}`} style={{ width: `${(frame.width || 1440) * zoom}px` }} /></div>{item.artifact.accessible_text && <details className="compare-text"><summary>Accessible text</summary><pre>{item.artifact.accessible_text}</pre></details>}</section>; })}</div>
  </dialog>;
}

function ArtifactCard({ skill, run, packet, artifact }: { skill: SkillSummary; run: RunReport; packet: TrialPacket; artifact: Artifact }) {
  const url = artifactUrl(skill, run, packet, artifact);
  const [pageIndex, setPageIndex] = useState(0);
  const previews = artifact.rendered_previews || [];
  const preview = previews[pageIndex];
  return <section className="artifact-card"><header><div><span className="file-type">{artifact.mime.startsWith("image/") ? "IMAGE" : artifact.path.split(".").pop()?.toUpperCase() || "FILE"}</span><span><strong>{artifact.path}</strong><small>{bytes(artifact.bytes)}</small></span></div><div className="artifact-actions">{artifact.mime === "text/html" && <a href={interactiveArtifactUrl(skill, run, packet, artifact)} target="_blank" rel="noreferrer">Open interactive preview</a>}<a href={url} target="_blank" rel="noreferrer">Download original</a></div></header>{preview && <figure className="rendered-preview"><div className="preview-toolbar"><Button size="1" variant="surface" aria-label="Previous artifact page" disabled={pageIndex === 0} onClick={() => setPageIndex((value) => value - 1)}>Previous</Button><span><strong>Page {pageIndex + 1} of {previews.length}</strong><small>{preview.label}</small></span><Button size="1" variant="surface" aria-label="Next artifact page" disabled={pageIndex === previews.length - 1} onClick={() => setPageIndex((value) => value + 1)}>Next</Button></div><img src={preview.url} alt={`Page ${pageIndex + 1} inert harness preview of ${artifact.path}`} /><div className="preview-thumbnails" aria-label="Artifact pages">{previews.map((frame, index) => <button key={frame.url} aria-label={`Show page ${index + 1}: ${frame.label || "untitled"}`} aria-pressed={index === pageIndex} onClick={() => setPageIndex(index)}><img src={frame.url} alt="" /><span>{index + 1}</span></button>)}</div><figcaption>Inert harness capture · artifact scripts did not run</figcaption></figure>}{!preview && artifact.preview_kind === "image" && <img src={url} alt={artifact.path} />}{artifact.preview_kind === "text" && <details><summary>View escaped source · {bytes(artifact.bytes)}</summary><pre>{artifact.preview}</pre></details>}{packet.annotations.filter((annotation) => annotation.artifact === "artifact" && annotation.artifact_path === artifact.path).map((annotation) => <p className="annotation" key={annotation.annotation_id}>{annotation.note}</p>)}</section>;
}

function HumanReview({ skill, run, packet, revealed, onReveal, onRefresh }: { skill: SkillSummary; run: RunReport; packet: TrialPacket; revealed?: { grades: Grade[]; disagreements: Array<{ metric: string; human: string; model: string }> }; onReveal: (value: { grades: Grade[]; disagreements: Array<{ metric: string; human: string; model: string }> }) => void; onRefresh: () => void }) {
  const [label, setLabel] = useState("pass");
  const [rationale, setRationale] = useState("");
  const [message, setMessage] = useState("");
  if (!packet.human_grader) return null;
  const save = async () => {
    if (!rationale.trim()) return setMessage("Write a rationale before saving.");
    try {
      await post("/api/grades", { skill: skill.id, run: run.run_id, trial_id: packet.trial.trial_id, label, rationale });
      setMessage("Human grade saved.");
      onRefresh();
    } catch (caught) { setMessage(caught instanceof Error ? caught.message : String(caught)); }
  };
  const reveal = async () => {
    try {
      const value = await request<{ grades: Grade[]; disagreements: Array<{ metric: string; human: string; model: string }> }>(`/api/trials/${encodeURIComponent(packet.trial.trial_id)}/judge?skill=${encodeURIComponent(skill.id)}&run=${encodeURIComponent(run.run_id)}`);
      onReveal(value);
    } catch (caught) { setMessage(caught instanceof Error ? caught.message : String(caught)); }
  };
  return <section className="human-review">{!packet.human_recorded ? <><strong>Blind human grade required</strong><p>Record your judgment before revealing the model judge.</p><div className="human-form"><select aria-label="Human grade" value={label} onChange={(event) => setLabel(event.target.value)}><option value="pass">Pass</option><option value="partial">Partial</option><option value="fail">Fail</option><option value="unknown">Unknown</option></select><textarea aria-label="Human rationale" placeholder="Cite output evidence." value={rationale} onChange={(event) => setRationale(event.target.value)} /><button onClick={() => void save()}>Save human grade</button></div></> : <><strong>Human grade: <Status value={packet.human_grade?.grade_status} /></strong><p>{packet.human_grade?.rationale}</p>{revealed ? <div className="revealed"><strong>Revealed model judge</strong><GradeList grades={revealed.grades} />{revealed.disagreements.map((item) => <p key={item.metric}>Disagreement on {item.metric}: human {item.human}, model {item.model}</p>)}</div> : <button onClick={() => void reveal()}>Reveal model judge</button>}</>}{message && <span className="action-message" role="status">{message}</span>}</section>;
}

function GradeList({ grades }: { grades: Grade[] }) {
  if (!grades.length) return <p>No grades recorded.</p>;
  return <div className="grade-list">{grades.map((grade, index) => <div key={`${grade.metric}-${index}`}><strong><Status value={grade.grade_status} /> {grade.metric || grade.grader?.id || "criterion"}</strong><p>{grade.rationale}</p>{grade.checks?.map((check, checkIndex) => <p key={checkIndex}>{check.name}: <Status value={check.label} /> — {check.evidence || check.note}</p>)}</div>)}</div>;
}

function promotable(packet: TrialPacket): boolean {
  return ["failed", "timed_out", "cancelled"].includes(packet.trial.status) || ["failed", "inconclusive", "unknown", "ungraded"].includes(packet.trial.verdict) || packet.annotations.length > 0;
}

function ReviewInspector({ skill, run, packet, open, onClose, onRefresh }: { skill: SkillSummary; run: RunReport; packet: TrialPacket; open: boolean; onClose: () => void; onRefresh: () => void }) {
  const firstTarget = packet.artifacts[0] ? `artifact:${packet.artifacts[0].path}` : "response";
  const [target, setTarget] = useState(firstTarget);
  const [tag, setTag] = useState<(typeof DIAGNOSES)[number][0]>("candidate-failure");
  const [judgeUse, setJudgeUse] = useState("exclude");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [promoteOpen, setPromoteOpen] = useState(false);
  const [caseId, setCaseId] = useState(`${packet.trial.eval_id}-regression`);
  const [expectation, setExpectation] = useState("");
  useEffect(() => { setTarget(packet.artifacts[0] ? `artifact:${packet.artifacts[0].path}` : "response"); setNote(""); setMessage(""); setPromoteOpen(false); setCaseId(`${packet.trial.eval_id}-regression`); }, [packet.trial.trial_id]);
  const saveFinding = async () => {
    if (!note.trim()) return setMessage("Write a finding first.");
    try {
      const artifact = target.startsWith("artifact:");
      await post("/api/annotations", { skill: skill.id, run: run.run_id, trial_id: packet.trial.trial_id, note, tag, judge_use: judgeUse, artifact: artifact ? "artifact" : "response", ...(artifact ? { artifact_path: target.slice(9) } : {}) });
      setNote(""); setMessage("Finding saved · review complete"); onRefresh();
    } catch (caught) { setMessage(caught instanceof Error ? caught.message : String(caught)); }
  };
  const looksGood = async () => {
    try { await post("/api/reviews", { skill: skill.id, run: run.run_id, trial_id: packet.trial.trial_id, decision: "looks_good" }); setMessage("Review complete"); onRefresh(); }
    catch (caught) { setMessage(caught instanceof Error ? caught.message : String(caught)); }
  };
  const promote = async () => {
    if (!expectation.trim()) return setMessage("Describe the expected behavior first.");
    try { await post("/api/evals", { skill: skill.id, run: run.run_id, trial_id: packet.trial.trial_id, id: caseId, type: "regression", priority: "high", expectations: [expectation], include_annotations: true, approved: true }); setMessage(`Added ${caseId}`); }
    catch (caught) { setMessage(caught instanceof Error ? caught.message : String(caught)); }
  };
  const diagnosis = DIAGNOSES.find((row) => row[0] === tag)!;
  return <aside className={`review-inspector ${open ? "is-open" : ""}`}><header><div><h2>Review evidence</h2><span>{packet.candidate_display || packet.trial.candidate} · {target === "response" ? "agent response" : target.slice(9)}</span></div><Button className="inspector-close" variant="ghost" size="1" onClick={onClose} aria-label="Close review panel">Close</Button><Icon name="pin" /></header>
    <label>Feedback about<select value={target} onChange={(event) => setTarget(event.target.value)}><option value="response">Agent response</option>{packet.artifacts.map((artifact) => <option value={`artifact:${artifact.path}`} key={artifact.path}>{artifact.path}</option>)}</select></label>
    <label>Evidence indicates<select value={tag} onChange={(event) => setTag(event.target.value as typeof tag)}>{DIAGNOSES.map((row) => <option value={row[0]} key={row[0]}>{row[1]}</option>)}</select><small>{diagnosis[2]}</small></label>
    <label>Judge use<small>Evidence is trial-specific; rubric guidance is reusable.</small><select value={judgeUse} onChange={(event) => setJudgeUse(event.target.value)}><option value="exclude">Exclude — review note only</option><option value="evidence">Evidence — this result</option><option value="rubric">Rubric — reusable guidance</option></select></label>
    <label>Finding<small>Summarize why and cite the evidence.</small><TextArea className="finding-textarea" resize="vertical" value={note} maxLength={1000} onChange={(event) => setNote(event.target.value)} placeholder="Describe the evidence and the change it supports." /><span className="character-count">{note.length} / 1000</span></label>
    <div className="inspector-actions"><Button className="secondary-action" variant="surface" disabled={Boolean(packet.review?.decision)} onClick={() => void looksGood()}>Looks good</Button><Button className="primary-action" variant="solid" onClick={() => void saveFinding()}>Save finding</Button></div>
    {promotable(packet) && <section className="promote"><button className="disclosure-button" onClick={() => setPromoteOpen((value) => !value)}>Promote finding to regression case</button>{promoteOpen && <div><label>Case ID<input value={caseId} onChange={(event) => setCaseId(event.target.value)} /></label><label>Expected behavior<input value={expectation} onChange={(event) => setExpectation(event.target.value)} /></label><button onClick={() => void promote()}>Add regression case</button></div>}</section>}
    {packet.annotations.map((annotation: Annotation) => <div className="saved-note" key={annotation.annotation_id}><strong>{annotation.tag}</strong><p>{annotation.note}</p></div>)}
    {message && <p className="inspector-message" role="status">{message}</p>}
  </aside>;
}
