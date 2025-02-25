import jwt from "jsonwebtoken";

export const generateToken = (res, user, message) => {
  const token = jwt.sign({
    _id: user._id}, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

  return res
  .status(200)
  .cookie("token", token, {
    httpOnly: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000
  })
  .json({
    success: true,
    message
  });
}