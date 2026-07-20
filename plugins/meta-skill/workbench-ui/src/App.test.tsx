import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";

const skill = {
  id: "html",
  name: "html",
  description: "Creates self-contained HTML artifacts.",
  path: "/tmp/html",
  suite_ready: true,
  eval_count: 1,
  run_count: 1,
};

const run = {
  run_id: "run-1",
  objective: "Compare the current skill",
  created_at: "2026-07-19T10:00:00Z",
  candidates: [{ candidate: "current", display: "Current skill" }],
  lifecycle: { status: "completed", phase: "finished", terminal_trials: 1, planned_trials: 1 },
  totals: { trials: 1, passed: 1, failed: 0, inconclusive: 0 },
  review: { reviewed: 1, total: 1 },
  plan: { cases: 1, candidates: 1, executions_per_case: 1, trials: 1 },
  cases: [{ eval_id: "case-a", versions: [{ candidate: "current", verdict: "passed", trials: [{ trial_id: "case-a.current.t1", eval_id: "case-a", candidate: "current", repetition: 1, status: "completed", verdict: "passed" }] }] }],
  trials: [{ trial_id: "case-a.current.t1", eval_id: "case-a", candidate: "current", repetition: 1, status: "completed", verdict: "passed", human_review_pending: false }],
};

const casePacket = {
  run_id: "run-1",
  eval_id: "case-a",
  task: "Create a useful artifact.",
  expectations: ["The artifact is self-contained."],
  trials: [{
    run_id: "run-1",
    candidate_display: "Current skill",
    trial: { trial_id: "case-a.current.t1", eval_id: "case-a", candidate: "current", repetition: 1, status: "completed", verdict: "passed", duration_ms: null, usage: null },
    response: "Created the artifact.",
    artifacts: [{
      path: "artifact.html", mime: "text/html", bytes: 1200, preview_kind: "text", preview: "<!doctype html>",
      rendered_previews: [
        { url: "/api/previews/page-1.png", generated_by: "harness", index: 1, label: "Opening", width: 1440, height: 900 },
        { url: "/api/previews/page-2.png", generated_by: "harness", index: 2, label: "Detail", width: 1440, height: 900 },
      ],
    }],
    transcript: { total: 0, shown: 0, items: [] },
    expectations: ["The artifact is self-contained."],
    grades: [],
    human_grader: null,
    human_grade: null,
    human_recorded: false,
    annotations: [],
    review: { decision: "looks_good" },
  }],
};

function response(body: object, status = 200) {
  return Promise.resolve(new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }));
}

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn((input: RequestInfo | URL) => {
    const path = String(input);
    if (path === "/api/skills") return response({ root: "/tmp", skills: [skill] });
    if (path === "/api/skills/html/runs") return response({ runs: [run] });
    if (path === "/api/runs/run-1?skill=html") return response(run);
    if (path === "/api/runs/run-1/cases/case-a?skill=html") return response(casePacket);
    return response({ error: `missing fixture: ${path}` }, 404);
  }));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("MetaSkill workbench", () => {
  it("renders runs as real links", async () => {
    history.replaceState({}, "", "/?filter=all");
    render(<App />);
    const link = await screen.findByRole("link", { name: /Compare the current skill/ });
    expect(link).toHaveAttribute("href", expect.stringContaining("run=run-1"));
    expect(screen.getByText("1×1×1 = 1")).toBeInTheDocument();
  });

  it("opens a case directly with bounded evidence and no passing-case promotion", async () => {
    history.replaceState({}, "", "/?skill=html&tab=runs&run=run-1&case=case-a&filter=all");
    const { container } = render(<App />);
    expect(await screen.findByRole("heading", { name: "case-a" })).toBeInTheDocument();
    expect(screen.getByText(/duration unknown/)).toBeInTheDocument();
    expect(screen.getByText(/tokens unknown/)).toBeInTheDocument();
    expect(screen.getByText("Runtime: completed")).toBeInTheDocument();
    expect(screen.getByText("View escaped source · 1.2 KB")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Review evidence" })).toBeInTheDocument();
    expect(screen.queryByText("Promote finding to regression case")).not.toBeInTheDocument();
    expect(container.querySelector("iframe")).toBeNull();
  });

  it("navigates inert artifact pages and exposes the isolated interactive action", async () => {
    history.replaceState({}, "", "/?skill=html&tab=runs&run=run-1&case=case-a&filter=all");
    render(<App />);
    expect(await screen.findByText("Page 1 of 2")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open interactive preview" })).toHaveAttribute("href", expect.stringContaining("/api/interactive/"));
    await userEvent.click(screen.getByRole("button", { name: "Next artifact page" }));
    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
    expect(screen.getByText("Detail")).toBeInTheDocument();
  });

  it("shows a retryable error when the API cannot load", async () => {
    vi.stubGlobal("fetch", vi.fn(() => response({ error: "fixture unavailable" }, 503)));
    history.replaceState({}, "", "/?filter=all");
    render(<App />);
    expect(await screen.findByRole("alert")).toHaveTextContent("fixture unavailable");
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("keeps the model judge hidden until the recorded human grade is revealed", async () => {
    const reviewedPacket = structuredClone(casePacket);
    reviewedPacket.trials[0].human_grader = { id: "human" };
    reviewedPacket.trials[0].human_recorded = true;
    reviewedPacket.trials[0].human_grade = { grade_status: "pass", rationale: "The artifact meets the case." };
    vi.stubGlobal("fetch", vi.fn((input: RequestInfo | URL) => {
      const path = String(input);
      if (path === "/api/skills") return response({ root: "/tmp", skills: [skill] });
      if (path === "/api/skills/html/runs") return response({ runs: [run] });
      if (path === "/api/runs/run-1?skill=html") return response(run);
      if (path === "/api/runs/run-1/cases/case-a?skill=html") return response(reviewedPacket);
      if (path === "/api/trials/case-a.current.t1/judge?skill=html&run=run-1") {
        return response({ grades: [{ metric: "useful", grade_status: "pass", rationale: "Useful output." }], disagreements: [] });
      }
      return response({ error: `missing fixture: ${path}` }, 404);
    }));
    history.replaceState({}, "", "/?skill=html&tab=runs&run=run-1&case=case-a&filter=all");
    render(<App />);
    const reveal = await screen.findByRole("button", { name: "Reveal model judge" });
    expect(screen.queryByText("Revealed model judge")).not.toBeInTheDocument();
    await userEvent.click(reveal);
    expect(await screen.findByText("Revealed model judge")).toBeInTheDocument();
    expect(screen.getByText("Useful output.")).toBeInTheDocument();
  });

  it("does not expose a judge-derived outcome before blind human review", async () => {
    const pendingPacket = structuredClone(casePacket);
    pendingPacket.trials[0].human_grader = { id: "human" };
    pendingPacket.trials[0].human_recorded = false;
    pendingPacket.trials[0].trial.verdict = "failed";
    pendingPacket.trials[0].grades = [{ metric: "useful", grade_status: "fail", rationale: "Hidden model judgment." }];
    vi.stubGlobal("fetch", vi.fn((input: RequestInfo | URL) => {
      const path = String(input);
      if (path === "/api/skills") return response({ root: "/tmp", skills: [skill] });
      if (path === "/api/skills/html/runs") return response({ runs: [run] });
      if (path === "/api/runs/run-1?skill=html") return response(run);
      if (path === "/api/runs/run-1/cases/case-a?skill=html") return response(pendingPacket);
      return response({ error: `missing fixture: ${path}` }, 404);
    }));
    history.replaceState({}, "", "/?skill=html&tab=runs&run=run-1&case=case-a&filter=all");
    render(<App />);
    expect(await screen.findByText("Blind outcome: hidden")).toBeInTheDocument();
    expect(screen.getByText("Outcome hidden")).toBeInTheDocument();
    expect(screen.queryByText("Hidden model judgment.")).not.toBeInTheDocument();
  });
});
