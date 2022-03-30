import { IProduct, IProductsInput } from "./../model/product";
import { NextFunction, Request, Response } from "express";
import { ReS } from "../utils/respone";
import ProductModel from "../model/product";

export const addProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // (IProductsInput because it is type by user)
    const product: IProductsInput = (req as any).body;
    console.log(product);
    const newProduct = new ProductModel(product);

    await newProduct.save();
    return res.status(200).json(ReS(200, newProduct));
  } catch (error) {
    console.log(error);
    next(error);
  }
};
