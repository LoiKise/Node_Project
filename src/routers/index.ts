import { Router } from "express";
import { productsRouter } from "./ProductsRouter/products.router";
import { userRouter } from "./ProductsRouter/users.router";

const rootRouter = Router();
rootRouter.use("/products", productsRouter);
rootRouter.use("/user", userRouter);

export default rootRouter;
