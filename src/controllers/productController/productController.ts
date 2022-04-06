import { IProduct, IProductsInput } from "../../model/product";
import { NextFunction, Request, Response } from "express";
import { ReE, ReS } from "../../utils/respone";
import ProductModel from "../../model/product";
import { request } from "http";
import { putImagPicture } from "../../utils/putObjectS3Picture";

export const addProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // (why IProductsInput because it is type by user)
    const { img, ...fromProuct } = req.body;

    const newProduct = new ProductModel(fromProuct);

    if ((req as any).file) {
      const urlSanPham = await putImagPicture(
        (req as any).file,
        req.body.productName
      );
      newProduct.img = urlSanPham;
    }

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

export const getAllProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allSanPham = await ProductModel.find();

    return res.status(200).json(ReS(200, allSanPham));
  } catch (error) {
    next(error);
  }
};
