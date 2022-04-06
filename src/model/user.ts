import IUser from "./user";
import { Schema, Model, connect, model } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
import ProductModel from "./product";

export interface IUserInput {
  userName: string;
  passWord: string;
  email: string;
  address: string;
  fullName: string;
  phone: string;
}

export type ICart = {
  _idProduct: string;
  productName: string;
  quantity: number;
  sale: boolean;
  percentSale: number;
  price: number;
  total: number;
  img: string;
  createDate?: string;
};

export interface IUser extends IUserInput {
  _id: object;
  admin: boolean;
  cart: ICart[];
}

export interface IUserModel extends Model<IUser> {
  checkSignIn(userName: string, passWord: string): IUser;
  checkSignUp(body: IUserInput): IUser;
  addProductToCart(_id: string, idProduct: string): IUser;
  minusProductToCart(_id: string, idProduct: string): IUser;
}

const userSchema = new Schema<IUser, IUserModel>(
  {
    userName: {
      type: String,
      required: [true, "please type user name"],
      trim: true,
      unique: true,
      validate(value: string) {
        if (value.length < 0 && value.length >= 15) {
          throw new Error("User Name (0-9)");
        }
      },
    },
    passWord: {
      type: String,
      required: [true, "please type password"],
      min: [6, "password (0-32)"],
      max: [32, "password (0-32)"],
      trim: true,
      set: (value: string) => {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(value, salt);
        return hash;
      },
    },
    email: {
      type: String,
      required: [true, "please type email"],
      trim: true,
      unique: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error("email invalid");
        }
      },
    },
    address: {
      type: String,
      require: false,
      trim: true,
    },
    fullName: {
      type: String,
      required: [true, "please type your name"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "please type your number phone"],
      trim: true,
      validate(value: string) {
        if (value.length <= 6 && value.length >= 15) {
          throw new Error("character (6 - 15)");
        }
      },
    },
    admin: {
      type: Boolean,
      require: true,
      default: false,
    },
    cart: [
      {
        _idProduct: {
          type: String,
          required: true,
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
          required: true,
        },
        percentSale: {
          type: Number,
          require: true,
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
        createDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

//Create database name productShema

// check acount(user & password) when user sign in
userSchema.static(
  "checkSignIn",
  async function (userName: string, passWord: string) {
    const user: IUser | null = await UserModel.findOne({
      userName,
    });
    console.log({ user });
    if (!user) {
      throw new Error("UserName is wrong");
    }
    const isMatch = await bcrypt.compare(passWord, user.passWord);
    if (!isMatch) {
      throw new Error("PassWord is wrong");
    }
    return user;
  }
);

// check account when user sign up

userSchema.static("checkSignUp", async function (body: IUserInput) {
  const user: IUser | null = await UserModel.findOne({
    $or: [
      { userName: body.userName },
      { email: body.email },
      { phone: body.phone },
    ],
  });
  if (!user) {
    return body;
  } else {
    throw new Error(
      body.email === user.email
        ? "Email is existed"
        : body.userName === user.userName
        ? "UserName is existed"
        : "phone is existed"
    );
  }
});

// add product to cart

userSchema.static(
  "addProductToCart",
  async function (_id: string, idProduct: string) {
    const user = await UserModel.findById({ _id });
    const productInCart = await UserModel.findOne({
      _id,
      "cart._idProduct": idProduct,
    });
    console.log(idProduct);
    const product = await ProductModel.findById({ _id: idProduct });
    console.log(product);
    if (user && product) {
      if (productInCart === null) {
        if (product.quantity <= 0) {
          throw new Error("Out of stock");
        } else {
          user.cart.push({
            _idProduct: idProduct,
            price: product.price,
            total: product.total,
            img: product.img,
            createDate: Date().toString(),
            percentSale: product.percentSale,
            sale: product.sale,
            quantity: 1,
            productName: product.productName,
          });
          product.quantity--;
          await product.save();
          await user.save();
          return user;
        }
      } else {
        if (product.quantity <= 0) {
          throw new Error("Out of stock");
        } else {
          const addQuantity = await UserModel.findOneAndUpdate(
            { _id },
            {
              $inc: {
                "cart.$[el].quantity": +1,
                "cart.$[el].price": +product.price,
                "cart.$[el].total": +product.total,
              },
            },
            {
              arrayFilters: [{ "el._idProduct": idProduct }],
              new: true,
            }
          );
          product.quantity--;

          await product.save();
          return addQuantity;
        }
      }
    } else {
      throw new Error("Can't find product");
    }
  }
);

// minus quanity in cart
userSchema.static(
  "minusProductToCart",
  async function (_id: string, idProduct: string) {
    const productInCart = await UserModel.findOne({
      _id,
      "cart._idProduct": idProduct,
    });
    const customer = await UserModel.findOne({ _id }).select({
      cart: { $elemMatch: { _idProduct: idProduct } },
    });
    const product = await ProductModel.findOne({ _id: idProduct });

    if (product && productInCart) {
      if (customer?.cart[0].quantity === 1) {
        await UserModel.findByIdAndUpdate(
          _id,
          {
            $pull: { cart: { _idProduct: idProduct } },
          },
          { safe: true, upsert: true }
        );
        product.quantity++;
        await product.save();
        const user = await ProductModel.findOne({ _id });
        return user;
      } else {
        const userUpdate = await ProductModel.findOneAndUpdate(
          { _id },
          {
            $inc: {
              "cart.$[el].quantity": +1,
              "cart.$[el].price": +product.price,
              "cart.$[el].total": +product.total,
            },
          },
          {
            arrayFilters: [{ "el._idProduct": idProduct }],
            new: true,
          }
        );
        product.quantity++;
        await product.save();
        return userUpdate;
      }
    } else {
      throw new Error("not found product");
    }
  }
);

const UserModel = model<IUser, IUserModel>("userSchema", userSchema);

export default UserModel;
