import { admin } from "./../../middleware/admin";
import {
  orderController,
  purchaseHistoryUserController,
  getAllpurchaseHistoryAllUserController,
} from "./../../controllers/billssController/billsController";
import { auth } from "./../../middleware/auth";
import { Router } from "express";

export const purchaseHistoryRouter = Router();

/**
 * * ORDER
 */

purchaseHistoryRouter.post("/Order", auth, orderController);

/**
 * * Get all bills by user
 */

purchaseHistoryRouter.get("/Bill/:id", auth, purchaseHistoryUserController);

purchaseHistoryRouter.get("/Bill", auth, purchaseHistoryUserController);

/**
 * * Get all bills by Admin
 * ! Just admin can do this
 */

purchaseHistoryRouter.get(
  "/GetBill",
  auth,
  admin,
  getAllpurchaseHistoryAllUserController
);

purchaseHistoryRouter.get(
  "/GetBillUser/",
  auth,

  purchaseHistoryUserController
);
