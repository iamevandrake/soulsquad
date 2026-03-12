/**
 * Middleware that enforces subscription tier limits on
 * project creation, agent creation, and heartbeat intervals.
 */
import type { Request, Response, NextFunction } from "express";
import type { Db } from "@paperclipai/db";
import { eq, count } from "drizzle-orm";
import { projects, agents } from "@paperclipai/db";
import { getCompanyTier, TIER_LIMITS } from "../services/stripe.js";

export function tierEnforcementMiddleware(db: Db) {
  return {
    checkProjectLimit: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const companyId = req.params.companyId as string;
        if (!companyId) return next();

        const tier = await getCompanyTier(db, companyId);
        const limits = TIER_LIMITS[tier];

        if (limits.maxProjects === -1) return next();

        const [result] = await db
          .select({ count: count() })
          .from(projects)
          .where(eq(projects.companyId, companyId));

        const currentCount = result?.count ?? 0;

        if (currentCount >= limits.maxProjects) {
          res.status(403).json({
            error: "tier_limit_exceeded",
            message: `Your ${tier} plan allows ${limits.maxProjects} project(s). Upgrade to Pro for unlimited projects.`,
            currentTier: tier,
            limit: limits.maxProjects,
            current: currentCount,
          });
          return;
        }

        next();
      } catch (err) {
        next(err);
      }
    },

    checkAgentLimit: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const companyId = req.params.companyId as string;
        if (!companyId) return next();

        const tier = await getCompanyTier(db, companyId);
        const limits = TIER_LIMITS[tier];

        const [result] = await db
          .select({ count: count() })
          .from(agents)
          .where(eq(agents.companyId, companyId));

        const currentCount = result?.count ?? 0;

        if (currentCount >= limits.maxAgents) {
          res.status(403).json({
            error: "tier_limit_exceeded",
            message: `Your ${tier} plan allows ${limits.maxAgents} agent(s). Upgrade to Pro for all 6 agents.`,
            currentTier: tier,
            limit: limits.maxAgents,
            current: currentCount,
          });
          return;
        }

        next();
      } catch (err) {
        next(err);
      }
    },

    getHeartbeatInterval: async (companyId: string): Promise<number> => {
      const tier = await getCompanyTier(db, companyId);
      return TIER_LIMITS[tier].heartbeatIntervalMs;
    },
  };
}
