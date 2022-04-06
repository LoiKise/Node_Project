import { admin } from "./../../middleware/admin";
import { Router } from "express";
import {
  addProductController,
  updateProductController,
  getAllProduct,
} from "../../controllers/productController/productController";
import { auth } from "../../middleware/auth";
import multer from "multer";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const productsRouter = Router();

productsRouter.get("/getProduct", getAllProduct);
productsRouter.post(
  "/addProduct",
  upload.single("img"),
  auth,
  admin,
  addProductController
);
productsRouter.patch("/updateProuduct/:id", updateProductController);
