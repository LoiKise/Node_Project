import {
  addProductIntoCartController,
  signInController,
  signUpController,
  getUserProfile,
  DeleteCart,
  getALlUser,
  minusProductIntoCartController,
} from "../../controllers/userController/userController";
import { Router } from "express";
// import {} from "../../controllers/userController/userController";
import { auth } from "../../middleware/auth";
import { admin } from "../../middleware/admin";

export const userRouter = Router();

userRouter.post("/signup", signUpController);
userRouter.post("/signin", signInController);
userRouter.get("/profile", auth, getUserProfile);
//thêm vào giỏ hàng (tăng số lượng)
userRouter.post("/addCart/:id", auth, addProductIntoCartController);
//Trừ vào giỏ hàng
userRouter.post("/MinusCart/:id", auth, minusProductIntoCartController);

userRouter.post("/DeleteCart/:id", auth, DeleteCart);
userRouter.get("/getAllUser", auth, admin, getALlUser);
