import express from "express";
import {
  login,
  register,
  request,
  requestAccepted,
} from "../controllers/userControllers.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();

router.route("/").post(register).get(login);
router.route("/followrequest").post(auth, request);
router.route("/acceptrequest").post(auth, requestAccepted);

export default router;
