import { IProduct, IProductsInput } from "../../model/product";
import { NextFunction, Request, Response } from "express";
import { ReE, ReS } from "../../utils/respone";
import ProductModel from "../../model/product";
import { request } from "http";
import { putImagPicture } from "../../utils/putObjectS3Picture";

interface IMath {
  category?: string;
}

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

export const getAllProductController = async (
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

export const deleteProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const _id = req.params.id;
  try {
    await ProductModel.findByIdAndDelete({ _id });
    return res.status(200).json(ReS(200, "delete product done"));
  } catch (error) {
    next(error);
  }
};

export const getProductByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let idProduct = req.params.id;
    const product = await ProductModel.findById({ _id: idProduct });
    res.status(200).json(ReS(200, product));
  } catch (error) {
    next(error);
  }
};

export const getProductByCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const match: IMath = {};
  if (req.query.category) {
    match.category = (req as any).query.category;
  }
  console.log(req.query.category);
  try {
    if (match.category) {
      const getAll = await ProductModel.find({ category: match.category });
      return res.status(200).json(ReS(200, getAll));
    }
  } catch (error) {
    next(error);
  }
};
