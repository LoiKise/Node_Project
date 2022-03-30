import express, { Application, NextFunction, Request, Response } from "express";
import rootRouter from "./routers";
import { ReE } from "./utils/respone";

const app: Application = express();

require("./db/mongooseConnect");
require("./model/product");

app.use(express.json()); // trả về kiểu json khi được gọi hoặc lấy
app.use("/api/v1", rootRouter);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  if (error.errors) {
    let ObecjError: any;
    Object.keys(error.errors).forEach((e: string) => {
      ObecjError[`${e}`] = error.errors[`${e}`].message;
    });
    return res.status(400).json(ReE(400, { ...ObecjError }));
  }
  if (error.message) {
    return res.status(400).json(ReE(400, error.message));
  }
  if (typeof error === "string") {
    res.status(400).json(ReE(400, error));
  }
  res.status(500).json(ReE(500, "ERROR"));
});

app.listen(5000, () => console.log("Server running"));
