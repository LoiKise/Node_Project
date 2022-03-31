import { Router } from "express";
import { addProductController } from "../../controllers/userController/userController";

export const userRouter = Router();

userRouter.post("/signup", addProductController);
