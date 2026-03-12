import {
  Crown,
  Compass,
  Palette,
  Film,
  TrendingUp,
  BarChart3,
} from "lucide-react";

const agents = [
  {
    icon: Crown,
    role: "Director",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    responsibilities:
      "Overall strategy, budget allocation, team coordination, performance reporting. The one who keeps everything on track.",
  },
  {
    icon: Compass,
    role: "Strategist",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    responsibilities:
      "Market research, competitive analysis, positioning, campaign planning, audience segmentation.",
  },
  {
    icon: Palette,
    role: "Creative",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    responsibilities:
      "Brand voice, copy, visual direction, content strategy, messaging frameworks.",
  },
  {
    icon: Film,
    role: "Producer",
    color: "text-green-400",
    bg: "bg-green-400/10",
    responsibilities:
      "Content production, asset creation, publishing workflows, editorial calendar management.",
  },
  {
    icon: TrendingUp,
    role: "Growth Marketer",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    responsibilities:
      "SEO, paid acquisition, conversion optimization, A/B testing, funnel optimization.",
  },
  {
    icon: BarChart3,
    role: "Analyst",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    responsibilities:
      "Performance measurement, attribution, reporting, data-driven recommendations, ROI analysis.",
  },
];

export function Agents() {
  return (
    <section id="agents" className="border-t border-white/5 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Meet your marketing team
          </h2>
          <p className="mt-4 text-lg text-white/40">
            Six specialized agents with clear roles, reporting lines, and
            delegation. Like a real agency, but they never sleep.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <div
              key={agent.role}
              className="card-glow rounded-2xl border border-white/5 bg-white/[0.02] p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${agent.bg}`}
                >
                  <agent.icon size={20} className={agent.color} />
                </div>
                <h3 className="text-lg font-semibold">{agent.role}</h3>
              </div>
              <p className="text-sm leading-relaxed text-white/40">
                {agent.responsibilities}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
