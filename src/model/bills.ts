import { IUser } from "./user";
import { Model, Schema, model } from "mongoose";
import moment from "moment";

export interface ICart {
  _idProduct: string;
  productName: string;
  quantity: number;
  sale: boolean;
  percentSale: number;
  price: number;
  total: number;
  img: string;
  createDateInproduct?: string;
}

export interface IPurchaseHistory {
  idUser: string;
  userName: string;
  email: string;
  address: string;
  fullName: string;
  phone: string;
  createDate: string;
  total: number;
  allProduct: ICart[];
}

export interface purchaseHistoryModel extends Model<IPurchaseHistory> {
  fineBeforeBuy(user: IUser): IPurchaseHistory;
}

const purchaseHistorySchema = new Schema<
  IPurchaseHistory,
  purchaseHistoryModel
>({
  idUser: {
    type: String,
    trim: true,
  },
  userName: {
    type: String,
    trim: true,
    required: [true, "tài khoản bị trống"],
  },
  email: {
    type: String,
    trim: true,
    required: [true, "email bị trống"],
  },
  address: {
    type: String,
    trim: true,
    required: [true, "địa chỉ không được trống"],
  },
  fullName: {
    type: String,
    trim: true,
    required: [true, "họ tên bị trống"],
  },
  phone: {
    type: String,
    trim: true,
    required: [true, "số điện thoại bị trống"],
  },
  createDate: {
    type: String,
    default: moment().format("MMMM Do YYYY, h:mm:ss a"),
  },
  total: {
    type: Number,
  },
  allProduct: [
    {
      _idProduct: {
        type: String,
        require: true,
        trim: true,
      },
      productName: {
        type: String,
        require: true,
        trim: true,
      },
      quantity: {
        type: Number,
        require: true,
        trim: true,
      },
      sale: {
        type: Boolean,
      },
      percentSale: {
        type: Number,
      },
      price: {
        type: Number,
        require: false,
        trim: true,
      },
      total: {
        type: Number,
        require: false,
        trim: true,
      },
      img: {
        type: String,
        require: false,
        trim: true,
      },
    },
  ],
});

purchaseHistorySchema.static("fineBeforeBuy", async function (user: IUser) {
  if (!user) {
    throw new Error("Error");
  }
  const history = await purchaseHistoryModel.create({
    idUser: user._id.toString(),
    userName: user.userName,
    email: user.email,
    address: user.address,
    fullName: user.fullName,
    phone: user.phone,
    allProduct: user.cart,

    total: user.cart.reduce((a: number, b: ICart) => {
      return a + b.total;
    }, 0),
  });
  return history;
});

const purchaseHistoryModel = model<IPurchaseHistory, purchaseHistoryModel>(
  "lichSuMuaHangSchema",
  purchaseHistorySchema
);

export default purchaseHistoryModel;
