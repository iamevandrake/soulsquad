import { config } from "@/lib/config";
import { ArrowRight, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-grid pt-32 pb-20 md:pt-40 md:pb-32">
      {/* Gradient orbs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-brand-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-20 right-0 h-[400px] w-[400px] rounded-full bg-brand-400/5 blur-[100px]" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300">
          <Zap size={14} />
          Built on open-source. Powered by your AI keys.
        </div>

        <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl lg:text-7xl">
          Your AI marketing
          <br />
          <span className="gradient-text">agency is live.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/50 md:text-xl">
          Six AI agents. One dashboard. Director, strategist, creative,
          producer, growth marketer, analyst. They run campaigns, create
          content, and optimize performance while you sleep.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href={`${config.apiUrl}/api/auth/signin/google`}
            className="group inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-600/25 hover:bg-brand-500 hover:shadow-brand-500/30 transition-all"
          >
            Deploy your team
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3.5 text-base font-medium text-white/70 hover:border-white/20 hover:text-white transition-all"
          >
            See how it works
          </a>
        </div>

        <p className="mt-6 text-sm text-white/30">
          Free tier available. No credit card required. BYOK.
        </p>
      </div>
    </section>
  );
}
