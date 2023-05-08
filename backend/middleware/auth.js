import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import expressAsyncHandler from "express-async-handler";
dotenv.config();

export const auth = expressAsyncHandler(async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    res.status(401);
    throw new Error("Unauthorized");
  }
  try {
    if (token.startsWith("Bearer")) {
      token = token.split(" ")[1];
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded).select("-password");
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not Authorized,token failed");
  }
});
