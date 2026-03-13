import { Router } from "express";
import type { Db } from "@paperclipai/db";
import { agents } from "@paperclipai/db";
import { TEAM_TEMPLATES, getTemplateById } from "../templates.js";
import { assertBoard, assertCompanyAccess } from "./authz.js";

export function templateRoutes(db: Db) {
  const router = Router();

  // List available templates (no auth required — used by landing page)
  router.get("/templates", (_req, res) => {
    const list = TEAM_TEMPLATES.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      agentCount: t.agentCount,
      agents: t.agents.map((a) => ({ name: a.name, role: a.role, title: a.title })),
    }));
    res.json(list);
  });

  // Seed a team from a template into an existing company
  router.post("/companies/:companyId/seed-template", async (req, res) => {
    const companyId = req.params.companyId as string;
    assertCompanyAccess(req, companyId);
    assertBoard(req);

    const { templateId } = req.body as { templateId?: string };
    if (!templateId) {
      res.status(400).json({ error: "templateId is required" });
      return;
    }

    const template = getTemplateById(templateId);
    if (!template) {
      res.status(404).json({ error: `Template "${templateId}" not found` });
      return;
    }

    // Create agents in order so we can wire up reporting
    const createdAgents: { id: string; name: string; role: string }[] = [];

    for (const agentDef of template.agents) {
      const reportsTo =
        agentDef.reportsToIndex >= 0 ? createdAgents[agentDef.reportsToIndex]?.id ?? null : null;

      const [created] = await db
        .insert(agents)
        .values({
          companyId,
          name: agentDef.name,
          role: agentDef.role,
          title: agentDef.title,
          capabilities: agentDef.capabilities,
          status: "idle",
          reportsTo,
          adapterType: "claude_local",
          adapterConfig: {},
          budgetMonthlyCents: 0,
          spentMonthlyCents: 0,
        })
        .returning({ id: agents.id, name: agents.name, role: agents.role });

      createdAgents.push(created!);
    }

    res.status(201).json({
      templateId: template.id,
      templateName: template.name,
      agents: createdAgents,
    });
  });

  return router;
}
