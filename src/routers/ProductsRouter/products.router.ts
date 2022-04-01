import { admin } from "./../../middleware/admin";
import { Router } from "express";
import {
  addProductController,
  updateProductController,
} from "../../controllers/productController/productController";
import { auth } from "../../middleware/auth";

export const productsRouter = Router();

productsRouter.post("/addProduct", auth, admin, addProductController);
productsRouter.patch("/updateProuduct/:id", updateProductController);
