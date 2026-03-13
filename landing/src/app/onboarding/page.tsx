"use client";

import { useState } from "react";
import { config } from "@/lib/config";
import {
  ArrowRight,
  ArrowLeft,
  Users,
  Key,
  Rocket,
  Check,
  Loader2,
} from "lucide-react";

type Step = "template" | "apikey" | "launch";

const TEMPLATES = [
  {
    id: "launch-campaign",
    name: "Launch Campaign",
    description: "Plan and execute a go-to-market campaign with a focused 4-agent team.",
    agentCount: 4,
    agents: ["Director", "Strategist", "Creative", "Growth Marketer"],
  },
  {
    id: "content-engine",
    name: "Content Engine",
    description: "Build a content machine that drives organic traffic with a 3-agent team.",
    agentCount: 3,
    agents: ["Producer", "Creative", "Analyst"],
  },
  {
    id: "full-agency",
    name: "Full Agency",
    description: "The complete AI marketing agency with all 6 specialist agents.",
    agentCount: 6,
    agents: ["Director", "Strategist", "Producer", "Creative", "Growth Marketer", "Analyst"],
  },
];

const STEPS: Step[] = ["template", "apikey", "launch"];

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>("template");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isLaunching, setIsLaunching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const template = TEMPLATES.find((t) => t.id === selectedTemplate);
  const stepIndex = STEPS.indexOf(step);

  async function handleLaunch() {
    if (!selectedTemplate) return;
    setIsLaunching(true);
    setError(null);

    try {
      // 1. Create the company
      const companyRes = await fetch(`${config.apiUrl}/api/companies`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: companyName || "My Marketing Agency",
        }),
      });

      if (!companyRes.ok) {
        throw new Error("Failed to create company");
      }

      const company = await companyRes.json();
      const companyId = company.id;

      // 2. Store the API key as a secret
      if (apiKey) {
        await fetch(`${config.apiUrl}/api/companies/${companyId}/secrets`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "ANTHROPIC_API_KEY",
            value: apiKey,
            description: "Claude API key for agent execution",
          }),
        });
      }

      // 3. Seed agent team from selected template
      const seedRes = await fetch(`${config.apiUrl}/api/companies/${companyId}/seed-template`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: selectedTemplate }),
      });

      if (!seedRes.ok) {
        throw new Error("Failed to create agent team");
      }

      // 4. Create a default project
      await fetch(`${config.apiUrl}/api/companies/${companyId}/projects`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: template?.name || "Marketing Campaign",
          description: `Agent team: ${template?.name}`,
        }),
      });

      // 5. Redirect to the dashboard
      window.location.href = `${config.apiUrl}`;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong",
      );
      setIsLaunching(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-midnight-950 px-6">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
                  s === step
                    ? "bg-brand-600 text-white"
                    : stepIndex > i
                      ? "bg-brand-600/20 text-brand-400"
                      : "bg-white/5 text-white/30"
                }`}
              >
                {stepIndex > i ? <Check size={14} /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className="h-px w-12 bg-white/10" />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Pick template */}
        {step === "template" && (
          <div>
            <div className="mb-2 flex items-center gap-2 text-brand-400">
              <Users size={18} />
              <span className="text-sm font-medium">Step 1</span>
            </div>
            <h1 className="text-2xl font-bold">
              Pick your agent team
            </h1>
            <p className="mt-2 text-white/40">
              Choose a pre-built team of AI agents for your marketing needs.
            </p>

            <div className="mt-8 space-y-3">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`w-full rounded-xl border p-4 text-left transition-all ${
                    selectedTemplate === t.id
                      ? "border-brand-500/50 bg-brand-600/10"
                      : "border-white/5 bg-white/[0.02] hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{t.name}</span>
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-white/40">
                      {t.agentCount} agents
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-white/40">
                    {t.description}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {t.agents.map((a) => (
                      <span
                        key={a}
                        className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-white/50"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep("apikey")}
              disabled={!selectedTemplate}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 font-medium text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-500 transition-colors"
            >
              Continue
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Step 2: API Key */}
        {step === "apikey" && (
          <div>
            <div className="mb-2 flex items-center gap-2 text-brand-400">
              <Key size={18} />
              <span className="text-sm font-medium">Step 2</span>
            </div>
            <h1 className="text-2xl font-bold">
              Connect your Claude API key
            </h1>
            <p className="mt-2 text-white/40">
              Your agents use your Anthropic API key directly. We encrypt it at
              rest and never see it in plaintext.
            </p>

            <div className="mt-8">
              <label className="mb-2 block text-sm font-medium text-white/60">
                Company / team name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Acme Marketing"
                className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-white placeholder-white/30 focus:border-brand-500/50 focus:outline-none"
              />
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-white/60">
                Anthropic API key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 font-mono text-sm text-white placeholder-white/30 focus:border-brand-500/50 focus:outline-none"
              />
              <p className="mt-2 text-xs text-white/30">
                Get your key at{" "}
                <a
                  href="https://console.anthropic.com/settings/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-400 hover:underline"
                >
                  console.anthropic.com
                </a>
                . You can also add this later.
              </p>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setStep("template")}
                className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-white/60 hover:border-white/20 transition-colors"
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <button
                onClick={() => setStep("launch")}
                disabled={!companyName}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 font-medium text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-500 transition-colors"
              >
                Continue
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Launch */}
        {step === "launch" && (
          <div className="text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600/10">
              <Rocket size={32} className="text-brand-400" />
            </div>
            <h1 className="text-2xl font-bold">Ready to launch</h1>
            <p className="mt-2 text-white/40">
              Your AI marketing agency is about to go live.
            </p>

            <div className="mt-8 rounded-xl border border-white/5 bg-white/[0.02] p-6 text-left">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/40">Team name</span>
                  <span className="font-medium">{companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Team template</span>
                  <span className="font-medium">{template?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Agents</span>
                  <span className="font-medium">{template?.agentCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">API key</span>
                  <span className="font-mono text-xs text-white/60">
                    {apiKey ? `${apiKey.slice(0, 12)}...` : "Not set (add later)"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Plan</span>
                  <span className="font-medium text-brand-400">
                    Free (1 project, {template?.agentCount} agents)
                  </span>
                </div>
              </div>
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-400">{error}</p>
            )}

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setStep("apikey")}
                className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-white/60 hover:border-white/20 transition-colors"
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <button
                onClick={handleLaunch}
                disabled={isLaunching}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 font-semibold text-white disabled:opacity-60 hover:bg-brand-500 transition-colors"
              >
                {isLaunching ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Launching...
                  </>
                ) : (
                  <>
                    Launch your agency
                    <Rocket size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
