import { config } from "@/lib/config";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="border-t border-white/5 py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
          Stop managing prompts.
          <br />
          <span className="gradient-text">Start managing outcomes.</span>
        </h2>
        <p className="mt-6 text-lg text-white/40">
          Your AI marketing agency is one click away. Free to start, scales
          when you're ready.
        </p>
        <a
          href={`${config.apiUrl}/api/auth/signin/google`}
          className="group mt-10 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-brand-600/25 hover:bg-brand-500 hover:shadow-brand-500/30 transition-all"
        >
          Deploy your team
          <ArrowRight
            size={20}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </a>
      </div>
    </section>
  );
}
