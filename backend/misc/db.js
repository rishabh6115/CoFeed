import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const db = async () => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to Database");
};
