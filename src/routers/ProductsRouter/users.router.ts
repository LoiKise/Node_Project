import { signInController } from "./../../controllers/userController/userController";
import { Router } from "express";
import { signUpController } from "../../controllers/userController/userController";

export const userRouter = Router();

userRouter.post("/signup", signUpController);
userRouter.post("/signin", signInController);
