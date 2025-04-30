export const RoleType = {
  PASSENGER: "passenger",
  DRIVER: "driver",
  ADMIN: "admin",
  SUPER_ADMIN: "super-admin",
};

export const VehicleType = {
  BIKE: "bike",
  CAR: "car",
  AUTO: "auto",
};
export const VehicleStatus = {
  APPROVED: "approved",
  PENDING: "pending",
  REJECTED: "rejected",
  BLOCKED: "blocked",
};

export const RideStatus = {
  REQUESTED: "requested",
  ACCEPTED: "accepted",
  STARTED: "started",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const PaymentMethod = {
  CASH: "cash",
  CARD: "card",
  UPI: "upi",
}
export const PaymentStatus = Object.freeze({
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
  REFUNDED: "refunded",
});


export const cookieOptions = Object.freeze({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
});
