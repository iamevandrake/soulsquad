"use client";

import { useState } from "react";
import { config } from "@/lib/config";
import {
  ArrowRight,
  ArrowLeft,
  Target,
  Key,
  Rocket,
  Check,
  Loader2,
} from "lucide-react";

type Step = "goal" | "apikey" | "launch";

const MARKETING_GOALS = [
  {
    id: "launch",
    title: "Product launch",
    description: "Launch a product to market with a coordinated campaign",
  },
  {
    id: "content",
    title: "Content engine",
    description: "Build a content machine that drives organic traffic",
  },
  {
    id: "growth",
    title: "Growth & acquisition",
    description: "Optimize funnels and scale paid + organic acquisition",
  },
  {
    id: "brand",
    title: "Brand building",
    description: "Establish brand voice, positioning, and market presence",
  },
  {
    id: "custom",
    title: "Custom objective",
    description: "Define your own marketing objective",
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>("goal");
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [customGoal, setCustomGoal] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isLaunching, setIsLaunching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goalText =
    selectedGoal === "custom"
      ? customGoal
      : MARKETING_GOALS.find((g) => g.id === selectedGoal)?.title ?? "";

  async function handleLaunch() {
    setIsLaunching(true);
    setError(null);

    try {
      // 1. Create the company in opensoul
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

      // 3. Create a default project with the goal
      await fetch(`${config.apiUrl}/api/companies/${companyId}/projects`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: goalText || "Marketing Campaign",
          description: `Goal: ${goalText}`,
        }),
      });

      // 4. Redirect to the opensoul dashboard
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
          {(["goal", "apikey", "launch"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
                  s === step
                    ? "bg-brand-600 text-white"
                    : (["goal", "apikey", "launch"].indexOf(step) > i
                      ? "bg-brand-600/20 text-brand-400"
                      : "bg-white/5 text-white/30")
                }`}
              >
                {["goal", "apikey", "launch"].indexOf(step) > i ? (
                  <Check size={14} />
                ) : (
                  i + 1
                )}
              </div>
              {i < 2 && (
                <div className="h-px w-12 bg-white/10" />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Goal */}
        {step === "goal" && (
          <div>
            <div className="mb-2 flex items-center gap-2 text-brand-400">
              <Target size={18} />
              <span className="text-sm font-medium">Step 1</span>
            </div>
            <h1 className="text-2xl font-bold">
              What's your marketing objective?
            </h1>
            <p className="mt-2 text-white/40">
              This helps your AI team know where to focus.
            </p>

            <div className="mt-8 space-y-3">
              {MARKETING_GOALS.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal.id)}
                  className={`w-full rounded-xl border p-4 text-left transition-all ${
                    selectedGoal === goal.id
                      ? "border-brand-500/50 bg-brand-600/10"
                      : "border-white/5 bg-white/[0.02] hover:border-white/10"
                  }`}
                >
                  <div className="font-medium">{goal.title}</div>
                  <div className="mt-1 text-sm text-white/40">
                    {goal.description}
                  </div>
                </button>
              ))}
            </div>

            {selectedGoal === "custom" && (
              <textarea
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                placeholder="Describe your marketing objective..."
                className="mt-4 w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-white placeholder-white/30 focus:border-brand-500/50 focus:outline-none"
                rows={3}
              />
            )}

            <button
              onClick={() => setStep("apikey")}
              disabled={!selectedGoal || (selectedGoal === "custom" && !customGoal)}
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
                onClick={() => setStep("goal")}
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
                  <span className="text-white/40">Objective</span>
                  <span className="font-medium">{goalText}</span>
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
                    Free (1 project, 3 agents)
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
