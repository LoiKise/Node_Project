import {
  addProductIntoCartController,
  signInController,
  signUpController,
  getUserProfile,
} from "../../controllers/userController/userController";
import { Router } from "express";
// import {} from "../../controllers/userController/userController";
import { auth } from "../../middleware/auth";

export const userRouter = Router();

userRouter.post("/signup", signUpController);
userRouter.post("/signin", signInController);
userRouter.get("/profile", auth, getUserProfile);
//thêm vào giỏ hàng (tăng số lượng)
userRouter.post("/addCart/:id", auth, addProductIntoCartController);
