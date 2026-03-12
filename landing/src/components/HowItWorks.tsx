import { Target, Users, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Target,
    title: "Set your objective",
    description:
      'Tell your agency what you need. "Launch product X to 10K signups in 90 days." "Build our content engine." "Optimize our funnel." Whatever the goal, they get to work.',
  },
  {
    number: "02",
    icon: Users,
    title: "Staff your agency",
    description:
      "Director, Strategist, Producer, Creative, Growth Marketer, Analyst. Pick your team or use the full squad. Each agent knows their role and works autonomously.",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Watch them execute",
    description:
      "Agents wake on schedule, check their queue, produce work, and hand off to each other. Review strategy. Approve campaigns. Monitor performance from one dashboard.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Three steps to a running agency
          </h2>
          <p className="mt-4 text-lg text-white/40">
            No prompt engineering. No workflow builders. Just outcomes.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="card-glow relative rounded-2xl border border-white/5 bg-white/[0.02] p-8"
            >
              <div className="mb-6 flex items-center gap-4">
                <span className="font-mono text-sm text-brand-400">
                  {step.number}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600/10">
                  <step.icon size={20} className="text-brand-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="mt-3 leading-relaxed text-white/40">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
