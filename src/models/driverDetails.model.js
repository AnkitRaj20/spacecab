import mongoose, { Schema } from "mongoose";
import { VehicleStatus, VehicleType } from "../constants/constant";

const DriverDetailsSchema = new Schema(
  {
    driverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Driver id is required"],
    },
    vehicleType: {
      type: String,
      enum: {
        values: [VehicleType.BIKE, VehicleType.CAR, VehicleType.AUTO],
        message: "Please select a valid level",
      },
      required: [true, "Please enter a vehicle type"],
    },
    model: {
      type: String,
      required: [true, "Please enter a vehicle model"],
    },
    vehicleNumber: {
      type: String,
      required: [true, "Please enter a vehicle number"],
    },
    capacity: {
      type: Number,
      required: [true, "Please enter a vehicle capacity"],
    },
    VehicleStatus: {
      type: String,
      enum: [
        VehicleStatus.APPROVED,
        VehicleStatus.PENDING,
        VehicleStatus.REJECTED,
        VehicleStatus.BLOCKED,
      ],
      default: VehicleStatus.PENDING,
    },
  },
  { timestamps: true }
);

export const DriverDetails = mongoose.model(
  "DriverDetails",
  DriverDetailsSchema
);
