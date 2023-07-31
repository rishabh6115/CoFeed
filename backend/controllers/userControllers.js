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

    res.status(201).json({ message: "Updation successfully" });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

export const requestAccepted = expressAsyncHandler(async (req, res) => {
  const { userId } = req.body;
  const { requestList, followerList } = req.user;

  if (userId === req.user._id.valueOf()) throw new Error("Bad Request");

  try {
    const isUserInRequestList = requestList.some((data) => data.equals(userId));
    console.log(isUserInRequestList);
    if (isUserInRequestList) {
      req.user.requestList = req.user.requestList.filter(
        (data) => !data.equals(userId)
      );
      req.user.followerList.push(userId);
      console.log(req.user.requestList);
    } else {
      throw new Error("Internal Server Error");
    }
    await req.user.save();

    const requestedUserToFollow = await User.findById(userId);
    requestedUserToFollow.followingList.push(req.user._id);

    await requestedUserToFollow.save();

    res.status(201).json({ message: "Request Accepted" });
  } catch (error) {
    res.status(500);
    throw new Error("Internal Server Error");
  }
});

export const deleteRequest = expressAsyncHandler(async (req, res) => {
  const { userId } = req.body;
  const { requestList } = req.user;
  if (userId === req.user._id.valueOf()) throw new Error("Bad Request");
  try {
    const isUserInRequestList = requestList.some((data) => data.equals(userId));
    if (isUserInRequestList) {
      req.user.requestList = requestList.filter((data) => !data.equals(userId));
    } else {
      throw new Error("Internal Server Error");
    }
    await req.user.save();

    res.status(201).json({ message: "updation successfully" });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});
export const removeFollowing = expressAsyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (userId === req.user._id.valueOf()) throw new Error("Bad Request");
  try {
    const isUserInFollowingList = req.user.followingList.some((data) =>
      data.equals(userId)
    );
    if (isUserInFollowingList) {
      req.user.followingList = req.user.followingList.filter(
        (data) => !data.equals(userId)
      );
    } else {
      throw new Error("Internal Server Error");
    }
    await req.user.save();

    const followedUser = await User.findById(userId);
    followedUser.followerList = followedUser.followerList.filter(
      (data) => !data.equals(req.user._id)
    );

    await followedUser.save();

    res.status(201).json({ message: "updation successfully" });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

export const removeFollower = expressAsyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (userId === req.user._id.valueOf()) throw new Error("Bad Request");
  try {
    const isUserInFollowerList = req.user.followerList.some((data) =>
      data.equals(userId)
    );
    if (isUserInFollowerList) {
      req.user.followerList = req.user.followerList.filter(
        (data) => !data.equals(userId)
      );
    } else {
      throw new Error("Internal Server Error");
    }
    await req.user.save();

    const user = await User.findById(userId);
    user.followingList = user.followingList.filter(
      (data) => !data.equals(req.user._id)
    );

    await user.save();

    res.status(201).json({ message: "updation successfully" });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});
