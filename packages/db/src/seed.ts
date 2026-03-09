import { createDb } from "./client.js";
import { companies, agents, goals, projects, issues } from "./schema/index.js";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is required");

const db = createDb(url);

console.log("Seeding opensoul marketing agency...");

const [company] = await db
  .insert(companies)
  .values({
    name: "opensoul agency",
    description: "An autonomous AI marketing agency",
    status: "active",
    budgetMonthlyCents: 50000,
  })
  .returning();

const [director] = await db
  .insert(agents)
  .values({
    companyId: company!.id,
    name: "Director",
    role: "director",
    title: "Marketing Director",
    status: "idle",
    adapterType: "claude_local",
    adapterConfig: { command: "claude" },
    budgetMonthlyCents: 15000,
  })
  .returning();

const [strategist] = await db
  .insert(agents)
  .values({
    companyId: company!.id,
    name: "Strategist",
    role: "strategist",
    title: "Marketing Strategist",
    status: "idle",
    reportsTo: director!.id,
    adapterType: "claude_local",
    adapterConfig: { command: "claude" },
    budgetMonthlyCents: 8000,
  })
  .returning();

const [producer] = await db
  .insert(agents)
  .values({
    companyId: company!.id,
    name: "Producer",
    role: "producer",
    title: "Content Producer",
    status: "idle",
    reportsTo: director!.id,
    adapterType: "claude_local",
    adapterConfig: { command: "claude" },
    budgetMonthlyCents: 8000,
  })
  .returning();

const [creative] = await db
  .insert(agents)
  .values({
    companyId: company!.id,
    name: "Creative",
    role: "creative",
    title: "Creative Lead",
    status: "idle",
    reportsTo: director!.id,
    adapterType: "claude_local",
    adapterConfig: { command: "claude" },
    budgetMonthlyCents: 8000,
  })
  .returning();

const [growth] = await db
  .insert(agents)
  .values({
    companyId: company!.id,
    name: "Growth Marketer",
    role: "growth_marketer",
    title: "Growth & Acquisition Lead",
    status: "idle",
    reportsTo: director!.id,
    adapterType: "claude_local",
    adapterConfig: { command: "claude" },
    budgetMonthlyCents: 8000,
  })
  .returning();

const [analyst] = await db
  .insert(agents)
  .values({
    companyId: company!.id,
    name: "Analyst",
    role: "analyst",
    title: "Marketing Analyst",
    status: "idle",
    reportsTo: director!.id,
    adapterType: "claude_local",
    adapterConfig: { command: "claude" },
    budgetMonthlyCents: 5000,
  })
  .returning();

const [goal] = await db
  .insert(goals)
  .values({
    companyId: company!.id,
    title: "Launch Campaign",
    description: "Plan and execute go-to-market campaign",
    level: "company",
    status: "active",
    ownerAgentId: director!.id,
  })
  .returning();

const [project] = await db
  .insert(projects)
  .values({
    companyId: company!.id,
    goalId: goal!.id,
    name: "Q1 Go-to-Market",
    description: "Full-funnel launch campaign",
    status: "in_progress",
    leadAgentId: director!.id,
  })
  .returning();

await db.insert(issues).values([
  {
    companyId: company!.id,
    projectId: project!.id,
    goalId: goal!.id,
    title: "Competitive landscape analysis",
    description: "Research top 5 competitors and identify positioning gaps",
    status: "todo",
    priority: "high",
    assigneeAgentId: strategist!.id,
    createdByAgentId: director!.id,
  },
  {
    companyId: company!.id,
    projectId: project!.id,
    goalId: goal!.id,
    title: "Brand messaging framework",
    description: "Define value props, voice, and key messaging for launch",
    status: "todo",
    priority: "high",
    assigneeAgentId: creative!.id,
    createdByAgentId: director!.id,
  },
  {
    companyId: company!.id,
    projectId: project!.id,
    goalId: goal!.id,
    title: "SEO keyword strategy",
    description: "Identify high-intent keywords and content plan for organic growth",
    status: "backlog",
    priority: "medium",
    assigneeAgentId: growth!.id,
    createdByAgentId: director!.id,
  },
]);

console.log("Seed complete — opensoul agency ready");
process.exit(0);
