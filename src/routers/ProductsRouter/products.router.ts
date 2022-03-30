import { Router } from "express";
import { addProductController } from "../../controllers/productController";

export const productsRouter = Router();

productsRouter.post("/addProduct", addProductController);
