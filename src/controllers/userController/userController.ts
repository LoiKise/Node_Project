import { ReS } from "./../../utils/respone";
import { NextFunction } from "express";
import { Response } from "express";
import { Request } from "express";
import { IUserInput } from "../../model/user";
import UserModel from "../../model/user";
import jwt from "jsonwebtoken";
import { secret_key } from "../../configs";

export const signUpController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const checkUser = await UserModel.checkSignUp((req as any).body);
    const userCreate = new UserModel(checkUser);
    console.log("sign up user type", userCreate);
    await userCreate.save();
    res.status(201).json(ReS(201, userCreate));
  } catch (error) {
    next(error);
  }
};

export const signInController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserModel.checkSignIn(
      (req as any).body.userName,
      (req as any).body.passWord
    );
    console.log("sign in", user);
    const token = await jwt.sign({ _id: user._id.toString() }, secret_key);
    return res.status(200).json(ReS(200, { token, user }));
  } catch (error) {
    next(error);
  }
};
