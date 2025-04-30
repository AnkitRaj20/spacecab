import mongoose from "mongoose";
import { PaymentMethod, PaymentStatus } from "../constants/constant";

const PaymentSchema = new mongoose.Schema({
  rideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ride",
    required: [true, "Please enter a ride id"],
  },
  amount: {
    type: Number,
    required: [true, "Please enter an amount"],
  },
  paymentMethod: {
    type: String,
    enum: {
      values: [PaymentMethod.CASH, PaymentMethod.CARD, PaymentMethod.UPI],
      message: "Please select a valid method",
    },
    required: [true, "Please enter a payment method"],
  },
  status: {
    type: String,
    enum: {
      values: [
        PaymentStatus.PENDING,
        PaymentStatus.SUCCESS,
        PaymentStatus.FAILED,
        PaymentStatus.REFUNDED,
      ],
      message: "Status can only be pending, success, failed or refunded",
    },
    default: PaymentStatus.PENDING,
  },
  transactionId: {
    type: String,
    required: [true, "Transaction ID is required"],
  },
  refundId: {
    type: String,
  },
  refundAmount: {
    type: Number,
    min: [0, "Refund amount cannot be negative"],
  },
  refundReason: {
    type: String,
  },
});

export const Payment = mongoose.model("Payment", PaymentSchema);
