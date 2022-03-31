require("dotenv").config(); // start environment

export const mongodb_client = process.env.MONGODB_CONNECT_CLIENT;
export const port = process.env.APP_PORT;
