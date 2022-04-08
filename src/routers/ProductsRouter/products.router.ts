import { getProductByCategoryController } from "./../../controllers/productController/productController";
import { admin } from "./../../middleware/admin";
import { Router } from "express";
import {
  addProductController,
  updateProductController,
  deleteProductController,
  getAllProductController,
  getProductByIdController,
  //getProductByCategoryController,
} from "../../controllers/productController/productController";
import { auth } from "../../middleware/auth";
import multer from "multer";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const productsRouter = Router();

productsRouter.get("/getProduct", getAllProductController);
productsRouter.post(
  "/addProduct",
  upload.single("img"),
  auth,
  admin,
  addProductController
);
productsRouter.patch("/updateProuduct/:id", updateProductController);

productsRouter.delete(
  "/deleteProduct/:id",
  auth,
  admin,
  deleteProductController
);

productsRouter.get("/getProductById/:id", getProductByIdController);

productsRouter.get("/getCategory", getProductByCategoryController);
