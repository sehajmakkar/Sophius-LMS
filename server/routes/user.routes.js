import express from "express";
import {
  authenticateUser,
  createUserAccount,
  getUserProfile,
  signOutUser,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import upload from "../utils/multer.js";
import { validateSignUp } from "../middleware/validation.middleware.js";

const router = express.Router();

// Auth Routes
router.post("/signup", validateSignUp, createUserAccount);
router.post("/login", authenticateUser);
router.post("/signout", signOutUser);

// Profile Routes
router.get("/profile", isAuthenticated, getUserProfile);
router.patch("/profile", 
  isAuthenticated, 
  upload.single("avatar"), 
  updateUserProfile);

export default router;
