import { asyncHandler } from "../utilities/asyncHandler.utility.js";
import { errorHandler } from "../utilities/errorHandler.utility.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  console.log("Cookies =>", req.cookies);
  console.log("Headers =>", req.headers.cookie);

  const token =
    req.cookies.token ||
    req.headers.authorization?.replace("Bearer ", "");

  console.log("Token =>", token);

  if (!token) {
    return next(new errorHandler("Invalid token", 401));
  }

  let tokenData;
  try {
    tokenData = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new errorHandler("Invalid or expired token", 401));
  }

  req.user = tokenData;

  next();
});