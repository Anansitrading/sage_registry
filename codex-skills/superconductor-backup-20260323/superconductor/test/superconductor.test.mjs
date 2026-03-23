import test from "node:test";
import assert from "node:assert/strict";

import {
  promptWorker,
  promptReview,
  promptReconcile,
  syncMatrixWithLedger,
} from "../bin/superconductor.mjs";

test("worker and review prompts leave verification to Gooey", () => {
  const workerPrompt = promptWorker([{ track_id: "checkout_20260323" }], 2, 10, 3);
  assert.match(workerPrompt, /status "implemented"/);
  assert.match(workerPrompt, /Gooey/i);
  assert.doesNotMatch(workerPrompt, /status "verified"/);

  const reviewPrompt = promptReview();
  assert.match(reviewPrompt, /Do not mark anything as "verified"/);

  const reconcilePrompt = promptReconcile();
  assert.match(reconcilePrompt, /Do not mark anything as "verified"/);
});

test("ledger sync maps Gooey verdicts back into matrix state", () => {
  const matrix = {
    run_id: "run-123",
    pipeline_stage: 8,
    requirements: [
      { id: "R-001", text: "Checkout works", status: "implemented", track_id: "checkout_20260323", claims: [] },
      { id: "R-002", text: "Errors handled", status: "implemented", track_id: "checkout_20260323", claims: [] },
      { id: "R-003", text: "Retries work", status: "implemented", track_id: "payments_20260323", claims: [] },
    ],
    completion_summary: {
      total: 3,
      pending: 0,
      in_track: 0,
      implemented: 3,
      verified: 0,
    },
  };

  const { matrix: synced } = syncMatrixWithLedger(matrix, [
    {
      requirementId: "R-001",
      trackId: "checkout_20260323",
      campaignId: "cmp-1",
      status: "passed",
      rcs: 0.93,
      pillarScores: { technical: 1, jtbd: 0.9, productIntent: 0.9, heuristicSupport: 0.8 },
      contradictionState: "clear",
      sessionRunIds: ["run-a", "run-b", "run-c"],
      evidenceOids: ["oid-a"],
      noteIds: [],
      summary: "Checkout works",
    },
    {
      requirementId: "R-002",
      trackId: "checkout_20260323",
      campaignId: "cmp-1",
      status: "failed",
      rcs: 0.21,
      pillarScores: { technical: 0.2, jtbd: 0.1, productIntent: 0.2, heuristicSupport: 0.3 },
      contradictionState: "clear",
      sessionRunIds: ["run-d", "run-e", "run-f"],
      evidenceOids: ["oid-b"],
      noteIds: [],
      summary: "Errors handled",
    },
    {
      requirementId: "R-003",
      trackId: "payments_20260323",
      campaignId: "cmp-1",
      status: "blocked",
      rcs: 0.1,
      pillarScores: { technical: 0, jtbd: 0, productIntent: 0, heuristicSupport: 0 },
      contradictionState: "unresolved",
      sessionRunIds: ["run-g"],
      evidenceOids: ["oid-c"],
      noteIds: [],
      summary: "Retries work",
    },
  ]);

  assert.equal(synced.requirements[0].status, "verified");
  assert.equal(synced.requirements[1].status, "needs_review");
  assert.equal(synced.requirements[2].status, "blocked");
  assert.equal(synced.completion_summary.verified, 1);
});

test("ledger sync keeps verification evidence on each requirement", () => {
  const matrix = {
    run_id: "run-123",
    pipeline_stage: 8,
    requirements: [
      { id: "R-001", text: "Checkout works", status: "implemented", track_id: "checkout_20260323", claims: [] },
    ],
    completion_summary: {
      total: 1,
      pending: 0,
      in_track: 0,
      implemented: 1,
      verified: 0,
    },
  };

  const { matrix: synced } = syncMatrixWithLedger(matrix, [
    {
      requirementId: "R-001",
      trackId: "checkout_20260323",
      campaignId: "cmp-1",
      status: "needs_review",
      rcs: 0.42,
      pillarScores: { technical: 0.5, jtbd: 0.4, productIntent: 0.4, heuristicSupport: 0.4 },
      contradictionState: "flagged",
      sessionRunIds: ["run-a"],
      evidenceOids: ["oid-a", "oid-b"],
      noteIds: ["note-a"],
      summary: "Checkout needs review",
    },
  ]);

  assert.deepEqual(synced.requirements[0].verification, {
    campaign_id: "cmp-1",
    verdict: "needs_review",
    rcs: 0.42,
    contradiction_state: "flagged",
    session_run_ids: ["run-a"],
    evidence_oids: ["oid-a", "oid-b"],
    note_ids: ["note-a"],
    summary: "Checkout needs review",
  });
});
