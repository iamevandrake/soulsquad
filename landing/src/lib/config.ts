export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3200",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
    proPriceId: process.env.STRIPE_PRO_PRICE_ID || "",
  },
} as const;

export const TIERS = {
  free: {
    name: "Free",
    price: 0,
    description: "Try it out. Bring your own Claude API key.",
    features: [
      "1 project",
      "3 agents (Director + 2)",
      "Hourly heartbeats",
      "Community support",
      "BYOK - you control AI costs",
    ],
    limits: {
      maxProjects: 1,
      maxAgents: 3,
      heartbeatIntervalMs: 3600000, // 60 min
    },
  },
  pro: {
    name: "Pro",
    price: 49,
    description: "Full agency. Unlimited projects. Priority execution.",
    features: [
      "Unlimited projects",
      "All 6 agents",
      "15-minute heartbeats",
      "Priority support",
      "BYOK - you control AI costs",
      "Custom agent instructions",
      "Advanced analytics",
    ],
    limits: {
      maxProjects: -1, // unlimited
      maxAgents: 6,
      heartbeatIntervalMs: 900000, // 15 min
    },
  },
} as const;

export type TierName = keyof typeof TIERS;
