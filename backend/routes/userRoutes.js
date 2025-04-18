import express from "express";

// controllers
import {
  createUser,
  loginUser,
  logOutCurrentUser,
  getAllUsers,
  getCurrentLoggedInProfile,
  updateCurrentLoggedInProfile,
} from "../controllers/userController.js";

// MiddleWares
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(createUser)
  .get(authenticate, authorizeAdmin, getAllUsers);

router.post("/auth", loginUser);

router.post("/logout", logOutCurrentUser);

router
  .route("/profile")
  .get(authenticate, getCurrentLoggedInProfile)
  .put(authenticate, updateCurrentLoggedInProfile);

export default router;
