// import mongoose from "mongoose";
import expressAsyncHandler from "express-async-handler";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../misc/generateToken.js";

export const register = expressAsyncHandler(async (req, res) => {
  const { name, email, password, location, pic } = req.body;
  if (!name || !email || !password || !location) {
    res.status(500);
    throw new Error("All details are not entered");
  }
  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (user) {
      res.status(500);
      throw new Error("User already present");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      location,
      pic,
    });
    console.log(newUser._id.valueOf());
    const token = generateToken(newUser._id.valueOf());
    // const obj = { newUser, token };
    if (newUser) {
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        location: newUser.location,
        pic: newUser.pic,
        requestList: newUser.requestList,
        followerList: newUser.followerList,
        followingList: newUser.followingList,
        createdAt: newUser.createdAt,
        token,
      });
    } else {
      res.status(400);
      throw new Error("Failed to create a user");
    }
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

export const login = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(500);
    throw new Error("All details are not entered");
  }
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) throw new Error("Email or Password entered is wrong");
    const token = generateToken(user._id.valueOf());
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      location: user.location,
      pic: user.pic,
      requestList: user.requestList,
      followerList: user.followerList,
      followingList: user.followingList,
      createdAt: user.createdAt,
      token,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

export const request = expressAsyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (userId === req.user._id.valueOf())
    throw new Error("User cannot follow own");
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("Invalid request");
    let founduser = false;
    user.requestList.forEach((data, index) => {
      if (data.valueOf() === req.user._id.valueOf()) {
        user.requestList.splice(index, 1);
        founduser = true;
      }
    });
    if (founduser === false) user.requestList.push(req.user._id);
    await user.save();

    res.status(201).json({ message: "updation successfully" });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

export const requestAccepted = expressAsyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (userId === req.user._id.valueOf())
    throw new Error("User cannot accept his own request");
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("Invalid request");
    let founduser = false;
    const loggedUser = await User.findById(req.user._id);
    loggedUser.requestList.forEach((data, index) => {
      console.log(data.valueOf());
      console.log(userId);
      if (data.valueOf() === userId) {
        loggedUser.requestList.splice(index, 1);
        founduser = true;
      }
    });
    console.log(founduser);
    if (founduser === true) loggedUser.followerList.push(userId);

    if (founduser === false) throw new Error("Internal Server Error");
    console.log(loggedUser);

    await user.save();

    res.status(201).json({ message: "updation successfully" });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});
export const deleteRequest = expressAsyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (userId === req.user._id.valueOf()) throw new Error("Bad Request");
  try {
    const user = await User.findById(req.user._id);
    if (!user) throw new Error("Invalid request");
    let founduser = false;
    user.requestList.forEach((data, index) => {
      if (data.valueOf() === userId.valueOf()) {
        user.requestList.splice(index, 1);
        founduser = true;
      }
    });

    if (founduser === false) throw new Error("Bad request");
    if (founduser === true) await user.save();
    res.status(201).json({ message: "updation successfully" });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});
