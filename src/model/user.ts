import { Schema, Model, connect, model } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

export interface IUserInput {
  userName: string;
  passWord: string;
  email: string;
  address: string;
  fullName: string;
  phone: number;
}

export type ICart = {
  _idProduct: string;
  productNameCart: string;
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
  cart: ICart;
}

export interface IUserModel extends Model<IUser> {
  checkSignIn(userName: string, passWord: string): IUser;
  checkSignUp(body: IUserInput): IUser;
  addProductToCart(_id: string, _idProduct: string): IUser;
}

const userSchema = new Schema<IUser>(
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
      type: Number,
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
        productNameCart: {
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
const UserModel = model<IUser, IUserModel>("userSchema", userSchema);

// check acount(user & password) when user sign in
userSchema.static(
  "checkSignIn",
  async function (userName: string, passWord: string) {
    try {
      const user: IUser | null = await UserModel.findOne({
        userName,
      });
      if (!user) {
        throw new Error("UserName is wrong");
      }
      const isMatch: boolean = await bcrypt.compare(passWord, user.passWord);
      if (!isMatch) {
        throw new Error("PassWord is wrong");
      }
      return user;
    } catch (error) {
      throw new Error("username or password is wrong");
    }
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

// userSchema.static(
//   "addProductToCart",
//   async function (_id: string, idProduct: string) {
//     const user = await UserModel.findOne({_id});
//     const productInCart = await UserModel.findOne({_id,'cart._idProduct':idProduct})
//   }
// );

export default UserModel;
