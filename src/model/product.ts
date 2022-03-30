import { Schema, Model, connect, model } from "mongoose";
import { ppid } from "process";

// 1. Create an interface representing a document in MongoDB.
// Người dùng sẽ nhập các trường này
export interface IProductsInput {
  productName: string;
  price: number;
  img?: string;
  detail: string;
  total?: number;
  percentSale?: number;
  quantity?: number;
  sale: boolean;
  category: string;
}

// It's when user type finish on client (show in postman)
export interface IProduct extends IProductsInput {
  _id: object;
}

export interface IProductModels extends Model<IProduct> {}

// khai báo
const productShema = new Schema<IProduct, IProductModels>({
  productName: {
    type: String,
    required: [true, "tên sản phẩm bị trống"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "giá tiền đang để trống"],
  },
  img: {
    type: String,
  },
  detail: {
    type: String,
    required: [true, "mô tả đang bị trống"],
  },
  total: {
    type: Number,
    default: 0,
  },
  percentSale: {
    type: Number,
    default: 0,
    validate: (value: Number) => {
      if (value < 0 && value > 100) {
        throw new Error("Phần trăm sale không hợp lệ");
      }
    },
  },
  quantity: {
    type: Number,
    default: 0,
  },
  sale: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    required: [true, "thể loại đang trống"],
    trim: true,
  },
});

const ProductModel = model<IProduct, IProductModels>(
  "productShema",
  productShema
);

export default ProductModel;
