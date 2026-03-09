import { describe, expect, it } from "vitest";
import { resolveJoinRequestAgentManagerId } from "../routes/access.js";

describe("resolveJoinRequestAgentManagerId", () => {
  it("returns null when no Director exists in the company agent list", () => {
    const managerId = resolveJoinRequestAgentManagerId([
      { id: "a1", role: "strategist", reportsTo: null },
      { id: "a2", role: "producer", reportsTo: "a1" },
    ]);

    expect(managerId).toBeNull();
  });

  it("selects the root Director when available", () => {
    const managerId = resolveJoinRequestAgentManagerId([
      { id: "dir-child", role: "director", reportsTo: "manager-1" },
      { id: "manager-1", role: "strategist", reportsTo: null },
      { id: "dir-root", role: "director", reportsTo: null },
    ]);

    expect(managerId).toBe("dir-root");
  });

  it("falls back to the first Director when no root Director is present", () => {
    const managerId = resolveJoinRequestAgentManagerId([
      { id: "dir-1", role: "director", reportsTo: "mgr" },
      { id: "dir-2", role: "director", reportsTo: "mgr" },
      { id: "mgr", role: "strategist", reportsTo: null },
    ]);

    expect(managerId).toBe("dir-1");
  });
});
