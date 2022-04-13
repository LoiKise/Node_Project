import { secret_key } from "./../configs/index";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ReE } from "../utils/respone";
import UserModel from "../model/user";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization) {
      return res
        .status(401)
        .send(ReE(401, { error: "do not have authenticate" }));
    }
    //const token: string = req.headers.authorization.replace("Bearer", "");
    const token: string = req.headers.authorization.replace("Bearer ", ""); //cut Bearn in author
    console.log({ token });
    const decoded: any = await jwt.verify(token, secret_key);

    const user = await UserModel.findOne({
      _id: decoded._id,
    });
    if (!user) {
      return res.status(401).send(ReE(401, { error: "Please authenticate!" }));
    }

    (req as any).user = user;
    (req as any).token = token;
    console.log(123);
    return next();
  } catch (error) {
    return res.status(401).send(ReE(401, { error: "Please authenticate!" }));
  }
};
