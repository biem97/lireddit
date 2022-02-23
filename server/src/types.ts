import { Request, Response } from "express";
import { Session, SessionData } from "express-session";
import { Redis } from "ioredis";

export type MyContext = {
  req: Request & {
    session: Session & { userId: number };
  } & Partial<SessionData>;
  res: Response;
  redis: Redis;
};
