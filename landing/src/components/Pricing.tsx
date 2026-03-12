import { Check } from "lucide-react";
import { config } from "@/lib/config";
import { TIERS } from "@/lib/config";

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-white/5 py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Simple pricing
          </h2>
          <p className="mt-4 text-lg text-white/40">
            You bring your own Claude API key, so you only pay for the AI usage
            you actually use. SoulSquad is just the platform.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {/* Free tier */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8">
            <div className="mb-6">
              <h3 className="text-xl font-semibold">{TIERS.free.name}</h3>
              <p className="mt-1 text-sm text-white/40">
                {TIERS.free.description}
              </p>
            </div>
            <div className="mb-8">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-white/40">/month</span>
            </div>
            <a
              href={`${config.apiUrl}/api/auth/signin/google`}
              className="block rounded-xl border border-white/10 px-6 py-3 text-center text-sm font-medium text-white hover:border-white/20 transition-colors"
            >
              Start free
            </a>
            <ul className="mt-8 space-y-3">
              {TIERS.free.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm">
                  <Check size={16} className="mt-0.5 shrink-0 text-white/30" />
                  <span className="text-white/60">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro tier */}
          <div className="relative rounded-2xl border border-brand-500/30 bg-brand-600/[0.05] p-8">
            <div className="absolute -top-3 right-6 rounded-full bg-brand-600 px-3 py-1 text-xs font-medium">
              Most popular
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold">{TIERS.pro.name}</h3>
              <p className="mt-1 text-sm text-white/40">
                {TIERS.pro.description}
              </p>
            </div>
            <div className="mb-8">
              <span className="text-4xl font-bold">
                ${TIERS.pro.price}
              </span>
              <span className="text-white/40">/month</span>
            </div>
            <a
              href={`${config.apiUrl}/api/auth/signin/google`}
              className="block rounded-xl bg-brand-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-brand-600/25 hover:bg-brand-500 transition-colors"
            >
              Get started
            </a>
            <ul className="mt-8 space-y-3">
              {TIERS.pro.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm">
                  <Check
                    size={16}
                    className="mt-0.5 shrink-0 text-brand-400"
                  />
                  <span className="text-white/60">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-white/30">
          All plans include BYOK (bring your own key). You pay Anthropic
          directly for Claude API usage. SoulSquad charges only for the
          platform.
        </p>
      </div>
    </section>
  );
}
