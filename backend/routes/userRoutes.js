import express from "express";
import {
  deleteRequest,
  dummy,
  login,
  register,
  removeFollower,
  removeFollowing,
  request,
  requestAccepted,
} from "../controllers/userControllers.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();

router.route("/").post(register);
router.route("/login").post(login);
router.route("/followrequest").post(auth, request);
router.route("/acceptrequest").post(auth, requestAccepted);
router.route("/deleterequest").post(auth, deleteRequest);
router.route("/remove-following/:userId").get(auth, removeFollowing);
router.route("/remove-follower/:userId").get(auth, removeFollower);
router.route("/dummy").get(dummy);

export default router;
