import { IProduct, IProductsInput } from "../../model/product";
import { NextFunction, Request, Response } from "express";
import { ReE, ReS } from "../../utils/respone";
import ProductModel from "../../model/product";

export const addProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // (why IProductsInput because it is type by user)
    const product: IProductsInput = (req as any).body;

    const newProduct = new ProductModel(product);

    await newProduct.save();
    return res.status(200).json(ReS(200, newProduct));
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const updateProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const _id = req.params.id;
  console.log(_id);
  const update = Object.keys(req.body);
  const allowUpdate = [
    "productName",
    "price",
    "detail",
    "percentSale",
    "sale",
    "category",
    "img",
  ];
  const isValiOperetion = update.every((update) => {
    return allowUpdate.includes(update);
  });
  if (!isValiOperetion) {
    return res.status(400).json(ReE(400, "type update on the field"));
  }
  try {
    const product: any = await ProductModel.findById({ _id });
    if (product === null) {
      return res.status(400).json(ReE(400, "Can't found your product with ID"));
    }
    update.forEach((update) => (product[update] = req.body[update]));
    await product.save();
    return res.status(200).json(ReS(200, product));
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//
