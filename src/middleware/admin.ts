import { ReE } from "./../utils/respone";
import { Response, NextFunction, Request } from "express";

export const admin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if ((req as any).user.admin) {
      return next();
    }
    return res.status(403).send(ReE(403, { error: "just admin can do it" }));
  } catch (error) {
    return res.status(401).send(ReE(401, { error: "Please authenticate!" }));
  }
};
