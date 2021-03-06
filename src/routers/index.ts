import { purchaseHistoryRouter } from "./purchaseHistoryRouter/purchaseHistory.router";
import { Router } from "express";
import { productsRouter } from "./ProductsRouter/products.router";
import { userRouter } from "./UserRouter/users.router";
//use this

const rootRouter = Router();
rootRouter.use("/products", productsRouter);
rootRouter.use("/user", userRouter);
rootRouter.use("/history", purchaseHistoryRouter);
export default rootRouter;
