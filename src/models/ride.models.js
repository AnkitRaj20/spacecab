import mongoose, { Schema } from "mongoose";
import { RideStatus } from "../constants/constant";

const RideSchema = new Schema(
  {
    driverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Driver Id is required"],
    },
    passengerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Passenger Id is required"],
    },
    // pickupLocation: {
    //   type: String,
    //   required: [true, "Please enter a pickup location"],
    // },
    // dropLocation: {
    //   type: String,
    //   required: [true, "Please enter a drop location"],
    // },
    pickupLocation: {
      coordinates: [Number],
      address: String,
    },
    dropLocation: {
      coordinates: [Number],
      address: String,
    },
    rideStatus: {
      type: String,
      enum: {
        values: [
          RideStatus.REQUESTED,
          RideStatus.ACCEPTED,
          RideStatus.STARTED,
          RideStatus.COMPLETED,
          RideStatus.CANCELLED,
        ],
        message: "Please select a valid level",
      },
      default: RideStatus.REQUESTED,
    },

    distance: {
      type: Number,
      required: [true, "Please enter a distance"],
    },
    fare: {
      type: Number,
      required: [true, "Please enter a fare"],
    },
    rideStartTime: {
      type: Date,
    },
    rideEndTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const Ride = mongoose.model("Ride", RideSchema);
