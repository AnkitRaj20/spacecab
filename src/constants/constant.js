export const RoleType = {
  PASSENGER: "passenger",
  DRIVER: "driver",
  ADMIN: "admin",
  SUPER_ADMIN: "super-admin",
};


export const cookieOptions = Object.freeze({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict"
});