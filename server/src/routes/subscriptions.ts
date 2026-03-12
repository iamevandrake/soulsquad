/**
 * API routes for SoulSquad subscription management.
 */
import { Router, type Request, type Response } from "express";
import type { Db } from "@paperclipai/db";
import {
  getCompanyTier,
  getCompanyStripeCustomerId,
  createCheckoutSession,
  createPortalSession,
  handleWebhookEvent,
  getStripe,
  TIER_LIMITS,
} from "../services/stripe.js";
import { assertBoard, assertCompanyAccess } from "./authz.js";

export function subscriptionRoutes(db: Db) {
  const router = Router();

  // Get current subscription tier and limits
  router.get(
    "/companies/:companyId/subscription",
    async (req: Request, res: Response) => {
      assertBoard(req);
      const companyId = req.params.companyId as string;
      assertCompanyAccess(req, companyId);

      const tier = await getCompanyTier(db, companyId);
      const limits = TIER_LIMITS[tier];

      res.json({ tier, limits });
    },
  );

  // Create Stripe Checkout session for upgrade
  router.post(
    "/companies/:companyId/checkout",
    async (req: Request, res: Response) => {
      assertBoard(req);
      const companyId = req.params.companyId as string;
      assertCompanyAccess(req, companyId);

      const currentTier = await getCompanyTier(db, companyId);
      if (currentTier === "pro") {
        res.status(400).json({ error: "Already on Pro tier" });
        return;
      }

      const apiUrl =
        process.env.PAPERCLIP_PUBLIC_URL ?? "https://api.soulsquad.ai";
      const frontendUrl =
        process.env.SOULSQUAD_FRONTEND_URL ?? "https://soulsquad.ai";

      const url = await createCheckoutSession({
        companyId,
        userId: req.actor.userId ?? "unknown",
        userEmail: (req.actor as { email?: string }).email ?? "",
        successUrl: `${apiUrl}/?checkout=success`,
        cancelUrl: `${frontendUrl}/#pricing`,
      });

      res.json({ url });
    },
  );

  // Create Stripe Customer Portal session
  router.post(
    "/companies/:companyId/portal",
    async (req: Request, res: Response) => {
      assertBoard(req);
      const companyId = req.params.companyId as string;
      assertCompanyAccess(req, companyId);

      const stripeCustomerId = await getCompanyStripeCustomerId(db, companyId);
      if (!stripeCustomerId) {
        res.status(400).json({ error: "No active subscription" });
        return;
      }

      const apiUrl =
        process.env.PAPERCLIP_PUBLIC_URL ?? "https://api.soulsquad.ai";

      const url = await createPortalSession({
        stripeCustomerId,
        returnUrl: `${apiUrl}/`,
      });

      res.json({ url });
    },
  );

  return router;
}

/**
 * Stripe webhook endpoint.
 * Must be mounted with express.raw() middleware for signature verification.
 */
export function stripeWebhookRoute(db: Db) {
  const router = Router();

  router.post(
    "/webhooks/stripe",
    async (req: Request, res: Response) => {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!webhookSecret) {
        res.status(500).json({ error: "Webhook secret not configured" });
        return;
      }

      const sig = req.headers["stripe-signature"];
      if (!sig) {
        res.status(400).json({ error: "Missing stripe-signature" });
        return;
      }

      let event;
      try {
        const stripe = getStripe();
        event = stripe.webhooks.constructEvent(
          req.body as Buffer,
          sig as string,
          webhookSecret,
        );
      } catch (err) {
        console.error("[stripe] Webhook signature verification failed:", err);
        res.status(400).json({ error: "Invalid signature" });
        return;
      }

      try {
        await handleWebhookEvent(db, event);
        res.json({ received: true });
      } catch (err) {
        console.error("[stripe] Webhook handler error:", err);
        res.status(500).json({ error: "Webhook handler failed" });
      }
    },
  );

  return router;
}
