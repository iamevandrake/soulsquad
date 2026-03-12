import { Key, Shield, DollarSign } from "lucide-react";

const points = [
  {
    icon: Key,
    title: "Your keys, your control",
    description:
      "Enter your Anthropic API key. Your agents use it directly. We never store plaintext keys -- everything is encrypted at rest.",
  },
  {
    icon: DollarSign,
    title: "Pay only for what you use",
    description:
      "No markup on AI costs. You pay Anthropic directly at their published rates. SoulSquad is just the orchestration layer.",
  },
  {
    icon: Shield,
    title: "Revoke anytime",
    description:
      "Rotate or revoke your API key whenever you want. Your agents stop, your data stays. Full control, always.",
  },
];

export function BYOK() {
  return (
    <section className="border-t border-white/5 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Bring your own keys.
              <br />
              <span className="text-white/40">Keep your margins.</span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/40">
              SoulSquad doesn't sit between you and your AI provider. Your
              agents call Claude directly with your API key. No per-token
              markup, no hidden fees, no vendor lock-in.
            </p>
          </div>
          <div className="space-y-6">
            {points.map((point) => (
              <div key={point.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-600/10">
                  <point.icon size={20} className="text-brand-400" />
                </div>
                <div>
                  <h3 className="font-semibold">{point.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/40">
                    {point.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
