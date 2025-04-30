import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { RoleType } from "../constants/constant.js";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Please enter an email"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Please enter an name"],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, "Please enter a mobile number"],
      unique: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      select: false,
    },
    profilePicture: {
      type: String,
    },
    role: {
      type: String,
      enum: [
        RoleType.PASSENGER,
        RoleType.DRIVER,
        RoleType.ADMIN,
        RoleType.SUPER_ADMIN,
      ],
      default: RoleType.PASSENGER,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
  },
  { timestamps: true }
);

// Runs before saving the user to the database
// pre is a hook
userSchema.pre("save", async function (next) {
  // If password is modified then run this code
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Check if the password is correct or not
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
