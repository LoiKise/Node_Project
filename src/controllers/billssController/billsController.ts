import { ReS } from "./../../utils/respone";
import { NextFunction } from "express";
import { Response } from "express";
import { Request } from "express";
import purchaseHistoryModel from "../../model/bills";

/**
 * * order
 */

export const orderController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if ((req as any).user.cart.length < 1) {
      return next("Không tìm thấy sản phẩm trong giỏ hàng");
    }
    if (!(req as any).user.phone && !(req as any).user.address) {
      return next("Bạn chưa nhập đầy dủ thông tin");
    }
    purchaseHistoryModel.fineBeforeBuy((req as any).user);
    (req as any).user.cart = [];
    await (req as any).user.save();
    const purchaseHistoryUser = await purchaseHistoryModel.find({
      idUser: (req as any).user._id.toString(),
    });
    return res.status(200).json(ReS(200, purchaseHistoryUser));
  } catch (error) {
    next(error);
  }
};

/**
 * * purchase History by user
 */

export const purchaseHistoryUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let _id = (req as any).params.id;
  try {
    if (_id) {
      const purchaseHistory = await purchaseHistoryModel.findOne({
        _id,
        idUser: (req as any).user._id.toString(),
      });
      return res.status(200).json(ReS(200, purchaseHistory));
    }
    const purchaseHistory = await purchaseHistoryModel.find({
      idUser: (req as any).user._id.toString(),
    });
    console.log(purchaseHistory);
    return res.status(200).json(ReS(200, purchaseHistory));
  } catch (error) {
    next(error);
  }
};

/**
 * * get all purchase history
 */

export const getAllpurchaseHistoryAllUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let _id = (req as any).params.id;
  try {
    if (_id) {
      const purchaseHistory = await purchaseHistoryModel.findById({ _id });
      return res.status(200).json(ReS(200, purchaseHistory));
    }
    const purchaseHistory = await purchaseHistoryModel.find();
    return res.status(200).json(ReS(200, purchaseHistory));
  } catch (error) {
    next(error);
  }
};
