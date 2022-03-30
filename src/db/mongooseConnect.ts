import { mongodb_client } from "./../configs/index";
import mongoose from "mongoose";

// connect database
mongoose
  .connect(mongodb_client)
  .then(() => {
    console.log("Conect success");
  })
  .catch(() => {
    console.log("Error connected");
  });
