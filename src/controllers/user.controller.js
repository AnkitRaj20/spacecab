import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.util.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import { uploadOnCloudinary } from "../utils/cloudinary.util.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { createToken } from "../middlewares/auth.middleware.js";
import { cookieOptions, RoleType } from "../constants/constant.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { email, password, name, mobile, role = RoleType.PASSENGER } = req.body;
  // Check all fields are present - validation
  if ([email, password, name].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  if (password.length < 4) {
    throw new ApiError(400, "Password must be at least 4 characters long");
  }

  // Check if user exists
  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  // Check if the  avatar file is present or not
  let profilePictureLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.profilePicture) &&
    req.files.profilePicture.length > 0
  ) {
    profilePictureLocalPath = req.files.profilePicture[0].path;
  }

  let profilePicture;
  if (profilePictureLocalPath) {
    // Upload to cloudinary
    profilePicture = await uploadOnCloudinary(profilePictureLocalPath);
  }

  const user = await User.create({
    email,
    password,
    name,
    mobile,
    profilePicture: profilePicture?.url,
    role,
  });

  if (!user) {
    throw new ApiError(500, "User registration failed");
  }
  const token = createToken(user._id);

  //* Converts Mongoose document to plain JS object, this will allow us to add extra property to the object
  const newUser = user.toObject();
  newUser.token = token;

  return res
    .status(201)
    .cookie("token", token, cookieOptions)
    .json(new ApiResponse(201, newUser, "User registered successfully"));
});

//* LOGIN CONTROLLER
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );
  if (!user || !(await user.isPasswordCorrect(password, user.password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = createToken(user._id);
  const newUser = user.toObject();
  newUser.token = token;

  return res
    .status(200)
    .cookie("token", token, cookieOptions)
    .json(new ApiResponse(200, newUser, `Welcome back ${user.name}`));
});

//* LOGOUT CONTROLLER
export const logoutUser = asyncHandler(async (req, res) => {
  const user = req.user;

  return res
    .status(200)
    .clearCookie("token", cookieOptions)
    .json(new ApiResponse(200, null, `Goodbye ${user.name}`));
});

//* UPDATE PROFILE CONTROLLER
export const updateProfileDetails = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        email,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User updated successfully"));
});

//* UPDATE PROFILE PICTURE CONTROLLER
export const updateProfilePictureFile = asyncHandler(async (req, res) => {
  const profilePictureLocalPath = req.file?.path;

  if (!profilePictureLocalPath) {
    throw new ApiError(400, "Profile Picture file is missing");
  }

  const profilePicture = await uploadOnCloudinary(profilePictureLocalPath);

  if (!profilePicture.url) {
    throw new ApiError(400, "Error while uploading on profilePicture");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        profilePicture: profilePicture.url,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "profilePicture image updated successfully")
    );
});

export const getUserData = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
});

export const getAllDrivers = asyncHandler(async (req, res) => {
  const drivers = await User.find({ role: RoleType.DRIVER });
  if (!drivers) {
    throw new ApiError(404, "No drivers found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, drivers, "Drivers fetched successfully"));
});
