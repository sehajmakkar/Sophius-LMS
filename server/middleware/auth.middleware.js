import jwt from "jsonwebtoken";
import { ApiError } from "./error.middleware.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new ApiError("Unauthorized User", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    console.error("Error authenticating user:", error);
    return res.status(500).json({ error: "Internal server error - authenticate" });
  }
}