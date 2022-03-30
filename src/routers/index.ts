import { Router } from "express";
import { productsRouter } from "./ProductsRouter/products.router";

const rootRouter = Router();
rootRouter.use("/products", productsRouter);

export default rootRouter;
