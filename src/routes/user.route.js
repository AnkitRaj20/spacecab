import { Router } from "express";
import {
  getAllDrivers,
  getUserData,
  loginUser,
  logoutUser,
  registerUser,
  updateProfileDetails,
  updateProfilePictureFile,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();
/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - mobile
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               name:
 *                 type: string
 *                 example: John Doe
 *               mobile:
 *                 type: string
 *                 example: 9876543210
 *               password:
 *                 type: string
 *                 example: secret123
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *               role:
 *                 type: string
 *                 enum:
 *                   - passenger
 *                   - driver
 *                   - admin
 *                   - super-admin
 *                 description: The role of the user. Choose from 'passenger', 'driver', 'admin', 'super-admin'.
 *                 example: passenger
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: driverone@gmail.com
 *                     name:
 *                       type: string
 *                       example: driver one
 *                     mobile:
 *                       type: string
 *                       example: 9876543290
 *                     role:
 *                       type: string
 *                       example: driver
 *                     isVerified:
 *                       type: boolean
 *                       example: false
 *                     isOnline:
 *                       type: boolean
 *                       example: false
 *                     _id:
 *                       type: string
 *                       example: "6811edf6cb2e060d76eae2b8"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-30T09:31:34.118Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-30T09:31:34.118Z"
 *                     __v:
 *                       type: integer
 *                       example: 0
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODExZWRmNmNiMmUwNjBkNzZlYWUyYjgiLCJpYXQiOjE3NDYwMDU0OTQsImV4cCI6MTc0NjA5MTg5NH0.a02l79SfbzTunW-0sRU-V-H4OKpmeycVbo6oBZRX5Bs"
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 success:
 *                   type: boolean
 *                   example: true
 */

router.route("/register").post(
  upload.fields([
    {
      name: "profilePicture",
      maxCount: 1,
    },
  ]),
  registerUser
);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       401:
 *         description: Invalid credentials
 */

router.route("/login").post(loginUser);

//! Secured routes
/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get current user's data
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data retrieved
 */

router.route("/").get(verifyToken, getUserData);

/**
 * @swagger
 * /user/drivers:
 *   get:
 *     summary: Get all drivers
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Drivers fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "6811edf6cb2e060d76eae2b8"
 *                       email:
 *                         type: string
 *                         example: "driverone@gmail.com"
 *                       name:
 *                         type: string
 *                         example: "driver one"
 *                       mobile:
 *                         type: string
 *                         example: "9876543290"
 *                       role:
 *                         type: string
 *                         example: "driver"
 *                       isVerified:
 *                         type: boolean
 *                         example: false
 *                       isOnline:
 *                         type: boolean
 *                         example: false
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-30T09:31:34.118Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-30T09:31:34.118Z"
 *                       __v:
 *                         type: number
 *                         example: 0
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Drivers fetched successfully"
 *                 success:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */

router.route("/drivers").get(verifyToken, getAllDrivers);

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Logout current user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */

router.route("/logout").post(verifyToken, logoutUser);

/**
 * @swagger
 * /user/update-profile:
 *   patch:
 *     summary: Update user's profile information
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Name
 *               mobile:
 *                 type: string
 *                 example: 9876543210
 *     responses:
 *       200:
 *         description: Profile updated
 */

router.route("/update-profile").patch(verifyToken, updateProfileDetails);

/**
 * @swagger
 * /user/update-profile-picture:
 *   patch:
 *     summary: Update user's profile picture
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile picture updated
 */

router
  .route("/update-profile-picture")
  .patch(
    verifyToken,
    upload.single("profilePicture"),
    updateProfilePictureFile
  );

export default router;
