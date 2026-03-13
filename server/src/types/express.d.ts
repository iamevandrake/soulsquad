import "express";

interface ActorNone {
  type: "none";
  source: "none";
  userId?: undefined;
  companyIds?: undefined;
  companyId?: undefined;
  isInstanceAdmin?: undefined;
  agentId?: undefined;
  keyId?: undefined;
  runId?: string;
}

interface ActorBoard {
  type: "board";
  userId: string;
  companyIds?: string[];
  companyId?: undefined;
  isInstanceAdmin: boolean;
  agentId?: undefined;
  keyId?: undefined;
  runId?: string;
  source: "local_implicit" | "session";
}

interface ActorAgent {
  type: "agent";
  agentId: string;
  companyId: string;
  userId?: undefined;
  companyIds?: undefined;
  isInstanceAdmin?: undefined;
  keyId?: string;
  runId?: string;
  source: "agent_jwt" | "agent_key";
}

type Actor = ActorNone | ActorBoard | ActorAgent;

declare global {
  namespace Express {
    interface Request {
      actor: Actor;
    }
  }
}
