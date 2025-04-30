import mongoose, { Schema } from "mongoose";

const RideFeedbackSchema = new Schema({
  rideId: {
    type: Schema.Types.ObjectId,
    ref: "Ride",
    required: [true, "Please enter a ride id"],
  },
  fromUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please enter a user id"],
  },
  toUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please enter a user id"],
  },
  rating: {
    type: Number,
    required: [true, "Please enter a rating"],
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating must be at most 5"],
  },
  comment: {
    type: String,
  },
});

export const RideFeedback = mongoose.model("RideFeedback", RideFeedbackSchema);
