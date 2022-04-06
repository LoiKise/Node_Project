import express, { Application, NextFunction, Request, Response } from "express";
import { port } from "./configs";
import rootRouter from "./routers";
import { ReE } from "./utils/respone";

require("dotenv").config();
const app: Application = express();
import cors from "cors";

app.use(cors());
app.use(express.json());

// create Schema in database
require("./db/mongooseConnect");
require("./model/product");
require("./model/user");

// trả về kiểu json khi được gọi hoặc lấy
app.use("/api/v1", rootRouter);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  // convert arry error of mongoose to object errror (when you have a lot of errror)
  if (error.errors) {
    let ObecjError: any;
    Object.keys(error.errors).forEach((e: string) => {
      ObecjError[`${e}`] = error.errors[`${e}`].message;
    });
    return res.status(400).json(ReE(400, { ...ObecjError }));
  }
  //if you have just one error export error message for you
  if (error.message) {
    return res.status(400).json(ReE(400, error.message));
  }
  if (typeof error === "string") {
    res.status(400).json(ReE(400, error));
  }
  res.status(500).json(ReE(500, "ERROR"));
});

app.listen(port, () => console.log(`Server running port ${port}`));
