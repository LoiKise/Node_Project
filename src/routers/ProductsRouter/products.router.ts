import { Router } from "express";
import {
  addProductController,
  updateProductController,
} from "../../controllers/productController/productController";

export const productsRouter = Router();

productsRouter.post("/addProduct", addProductController);
productsRouter.patch("/updateProuduct/:id", updateProductController);
