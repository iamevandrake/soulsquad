/**
 * Pre-built agent team templates for SoulSquad onboarding.
 * Each template defines a set of agents with roles and reporting structure.
 */

export interface TemplateAgent {
  name: string;
  role: string;
  title: string;
  capabilities: string;
  /** Index into the template's agents array for the agent this one reports to. -1 = top-level. */
  reportsToIndex: number;
}

export interface TeamTemplate {
  id: string;
  name: string;
  description: string;
  agentCount: number;
  agents: TemplateAgent[];
}

export const TEAM_TEMPLATES: TeamTemplate[] = [
  {
    id: "launch-campaign",
    name: "Launch Campaign",
    description: "Plan and execute a go-to-market campaign with a focused 4-agent team.",
    agentCount: 4,
    agents: [
      {
        name: "Director",
        role: "director",
        title: "Marketing Director",
        capabilities: "Campaign planning, team coordination, stakeholder communication, budget management",
        reportsToIndex: -1,
      },
      {
        name: "Strategist",
        role: "strategist",
        title: "Marketing Strategist",
        capabilities: "Market research, competitive analysis, positioning, campaign strategy",
        reportsToIndex: 0,
      },
      {
        name: "Creative",
        role: "creative",
        title: "Creative Lead",
        capabilities: "Copywriting, brand messaging, content creation, visual direction",
        reportsToIndex: 0,
      },
      {
        name: "Growth Marketer",
        role: "growth_marketer",
        title: "Growth & Acquisition Lead",
        capabilities: "SEO, paid ads, funnel optimization, conversion rate optimization",
        reportsToIndex: 0,
      },
    ],
  },
  {
    id: "content-engine",
    name: "Content Engine",
    description: "Build a content machine that drives organic traffic with a 3-agent team.",
    agentCount: 3,
    agents: [
      {
        name: "Producer",
        role: "producer",
        title: "Content Producer",
        capabilities: "Editorial planning, content calendar, workflow management, publishing",
        reportsToIndex: -1,
      },
      {
        name: "Creative",
        role: "creative",
        title: "Creative Writer",
        capabilities: "Blog posts, social media content, email copy, landing pages",
        reportsToIndex: 0,
      },
      {
        name: "Analyst",
        role: "analyst",
        title: "Content Analyst",
        capabilities: "SEO research, keyword analysis, performance tracking, content gap analysis",
        reportsToIndex: 0,
      },
    ],
  },
  {
    id: "full-agency",
    name: "Full Agency",
    description: "The complete AI marketing agency with all 6 specialist agents.",
    agentCount: 6,
    agents: [
      {
        name: "Director",
        role: "director",
        title: "Marketing Director",
        capabilities: "Campaign planning, team coordination, stakeholder communication, budget management",
        reportsToIndex: -1,
      },
      {
        name: "Strategist",
        role: "strategist",
        title: "Marketing Strategist",
        capabilities: "Market research, competitive analysis, positioning, campaign strategy",
        reportsToIndex: 0,
      },
      {
        name: "Producer",
        role: "producer",
        title: "Content Producer",
        capabilities: "Editorial planning, content calendar, workflow management, publishing",
        reportsToIndex: 0,
      },
      {
        name: "Creative",
        role: "creative",
        title: "Creative Lead",
        capabilities: "Copywriting, brand messaging, content creation, visual direction",
        reportsToIndex: 0,
      },
      {
        name: "Growth Marketer",
        role: "growth_marketer",
        title: "Growth & Acquisition Lead",
        capabilities: "SEO, paid ads, funnel optimization, conversion rate optimization",
        reportsToIndex: 0,
      },
      {
        name: "Analyst",
        role: "analyst",
        title: "Marketing Analyst",
        capabilities: "Performance tracking, reporting, data analysis, ROI measurement",
        reportsToIndex: 0,
      },
    ],
  },
];

export function getTemplateById(id: string): TeamTemplate | undefined {
  return TEAM_TEMPLATES.find((t) => t.id === id);
}
