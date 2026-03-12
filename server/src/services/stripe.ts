/**
 * Stripe integration for SoulSquad hosted tiers.
 * Handles checkout session creation, webhook processing,
 * and subscription status management.
 */
import Stripe from "stripe";
import type { Db } from "@paperclipai/db";
import { eq } from "drizzle-orm";
import { companies } from "@paperclipai/db";

export const TIER_LIMITS = {
  free: {
    maxProjects: 1,
    maxAgents: 3,
    heartbeatIntervalMs: 3600000, // 60 min
  },
  pro: {
    maxProjects: -1, // unlimited
    maxAgents: 6,
    heartbeatIntervalMs: 900000, // 15 min
  },
} as const;

export type TierName = keyof typeof TIER_LIMITS;

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  if (!stripeInstance) {
    stripeInstance = new Stripe(key, { apiVersion: "2024-12-18.acacia" as Stripe.LatestApiVersion });
  }
  return stripeInstance;
}

export async function createCheckoutSession(opts: {
  companyId: string;
  userId: string;
  userEmail: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<string> {
  const stripe = getStripe();
  const priceId = process.env.STRIPE_PRO_PRICE_ID;
  if (!priceId) {
    throw new Error("STRIPE_PRO_PRICE_ID is not configured");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: opts.userEmail,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: opts.successUrl,
    cancel_url: opts.cancelUrl,
    metadata: {
      companyId: opts.companyId,
      userId: opts.userId,
    },
    subscription_data: {
      metadata: {
        companyId: opts.companyId,
        userId: opts.userId,
      },
    },
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session");
  }

  return session.url;
}

export async function createPortalSession(opts: {
  stripeCustomerId: string;
  returnUrl: string;
}): Promise<string> {
  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: opts.stripeCustomerId,
    return_url: opts.returnUrl,
  });
  return session.url;
}

export async function handleWebhookEvent(
  db: Db,
  event: Stripe.Event,
): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const companyId = session.metadata?.companyId;
      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id;
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;

      if (companyId && customerId) {
        await updateCompanySubscription(db, {
          companyId,
          tier: "pro",
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId ?? null,
        });
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const companyId = subscription.metadata?.companyId;

      if (companyId) {
        const isActive =
          subscription.status === "active" ||
          subscription.status === "trialing";
        await updateCompanySubscription(db, {
          companyId,
          tier: isActive ? "pro" : "free",
          stripeCustomerId:
            typeof subscription.customer === "string"
              ? subscription.customer
              : subscription.customer.id,
          stripeSubscriptionId: subscription.id,
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const companyId = subscription.metadata?.companyId;

      if (companyId) {
        await updateCompanySubscription(db, {
          companyId,
          tier: "free",
          stripeCustomerId:
            typeof subscription.customer === "string"
              ? subscription.customer
              : subscription.customer.id,
          stripeSubscriptionId: null,
        });
      }
      break;
    }
  }
}

async function updateCompanySubscription(
  db: Db,
  opts: {
    companyId: string;
    tier: TierName;
    stripeCustomerId: string;
    stripeSubscriptionId: string | null;
  },
): Promise<void> {
  const existing = await db
    .select()
    .from(companies)
    .where(eq(companies.id, opts.companyId))
    .limit(1);

  if (existing.length === 0) return;

  const currentMeta =
    (existing[0].metadata as Record<string, unknown>) ?? {};

  const updatedMeta = {
    ...currentMeta,
    subscription: {
      tier: opts.tier,
      stripeCustomerId: opts.stripeCustomerId,
      stripeSubscriptionId: opts.stripeSubscriptionId,
      updatedAt: new Date().toISOString(),
    },
  };

  await db
    .update(companies)
    .set({ metadata: updatedMeta })
    .where(eq(companies.id, opts.companyId));
}

export async function getCompanyTier(
  db: Db,
  companyId: string,
): Promise<TierName> {
  const result = await db
    .select()
    .from(companies)
    .where(eq(companies.id, companyId))
    .limit(1);

  if (result.length === 0) return "free";

  const meta = result[0].metadata as Record<string, unknown> | null;
  const subscription = meta?.subscription as
    | { tier?: string }
    | null
    | undefined;

  if (subscription?.tier === "pro") return "pro";
  return "free";
}

export async function getCompanyStripeCustomerId(
  db: Db,
  companyId: string,
): Promise<string | null> {
  const result = await db
    .select()
    .from(companies)
    .where(eq(companies.id, companyId))
    .limit(1);

  if (result.length === 0) return null;

  const meta = result[0].metadata as Record<string, unknown> | null;
  const subscription = meta?.subscription as
    | { stripeCustomerId?: string }
    | null
    | undefined;

  return subscription?.stripeCustomerId ?? null;
}
