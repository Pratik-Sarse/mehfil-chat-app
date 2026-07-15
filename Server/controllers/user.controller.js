import User from "../models/user.model.js";
import { asyncHandler } from "../utilities/asyncHandler.utility.js";
import { errorHandler } from "../utilities/errorHandler.utility.js";
// import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = asyncHandler(async (req, res, next) => {
  const { fullName, username, password, gender } = req.body;

  if (!fullName || !username || !password || !gender) {
    return next(new errorHandler("All fields are required", 400));
  }

  const user = await User.findOne({ username });
  if (user) {
    return next(new errorHandler("User already exists", 400));
  }

  // const hashedPassword = await bcrypt.hash(password, 10);

  // const avatarType = gender === "male" ? "boy" : "girl";
  const avatar =
    gender === "male"
      ? `https://api.dicebear.com/9.x/adventurer/svg?seed=${username}`
      : `https://api.dicebear.com/9.x/notionists/svg?seed=${username}`;

  const newUser = await User.create({
    username,
    fullName,
    password: password,
    gender,
    avatar,
  });

  const tokenData = {
    _id: newUser?._id,
  };

  const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  // avoid returning password to client
  const userToReturn = newUser.toObject ? newUser.toObject() : newUser;
  if (userToReturn.password) delete userToReturn.password;

  res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      responseData: {
        user: userToReturn,
        token,
      },
    });
});

export const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(
      new errorHandler("Please enter a valid username or password", 400)
    );
  }

  const user = await User.findOne({ username });
  if (!user) {
    return next(
      new errorHandler("Please enter a valid username or password", 400)
    );
  }

  // const isValidPassword = await bcrypt.compare(password, user.password);
  // if (!isValidPassword) {
  //   return next(
  //     new errorHandler("Please enter a valid username or password", 400)
  //   );
  // }

  const tokenData = {
    _id: user?._id,
  };

  const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  // avoid returning password to client
  const userToReturn = user.toObject ? user.toObject() : user;
  if (userToReturn.password) delete userToReturn.password;

  res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      responseData: {
        user: userToReturn,
        token,
      },
    });
});

export const getProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const profile = await User.findById(userId);

  res.status(200).json({
    success: true,
    responseData: profile,
  });
});

export const logout = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
    })
    .json({
      success: true,
      message: "Logout successfull!",
    });
});

export const getOtherUsers = asyncHandler(async (req, res, next) => {
  const otherUsers = await User.find({ _id: { $ne: req.user._id } });

  res.status(200).json({
    success: true,
    responseData: otherUsers,
  });
});