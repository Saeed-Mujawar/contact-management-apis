const express = require("express");
const {
    registerUser,
    currentUser,
    loginUser,
    updateUser,
    logoutUser,
    requestPasswordReset,
    resetPassword,
    deleteUser
} = require("../controllers/userController.js");
const validateToken = require("../middleware/validateTokenHandler.js");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management operations
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     tags: [Users]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags: [Users]
 *     summary: Log in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     tags: [Users]
 *     summary: Log out a user
 *     security:
 *       - bearerAuth: [] 
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post("/logout", validateToken, logoutUser);

/**
 * @swagger
 * /api/users/current:
 *   get:
 *     tags: [Users]
 *     summary: Get the current user details
 *     security:
 *       - bearerAuth: []  
 *     responses:
 *       200:
 *         description: Current user details
 *       401:
 *         description: Unauthorized
 */
router.get("/current", validateToken, currentUser);

/**
 * @swagger
 * /api/users/update:
 *   put:
 *     tags: [Users]
 *     summary: Update user details
 *     security:
 *       - bearerAuth: []  
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 */
router.put("/update", validateToken, updateUser);

/**
 * @swagger
 * /api/users/request-password-reset:
 *   post:
 *     tags: [Users]
 *     summary: Request a password reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset link sent
 *       404:
 *         description: User not found
 */
router.post("/request-password-reset", requestPasswordReset);

/**
 * @swagger
 * /api/users/reset-password/{token}:
 *   post:
 *     tags: [Users]
 *     summary: Reset user password
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: The password reset token
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Validation error or invalid token
 */
router.post("/reset-password/:token", resetPassword);

/**
 * @swagger
 * /api/users/delete:
 *   delete:
 *     tags: [Users]
 *     summary: Delete user account and all associated contacts
 *     security:
 *       - bearerAuth: []  
 *     responses:
 *       200:
 *         description: User account and all associated contacts deleted successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */

router.delete("/delete",validateToken, deleteUser);


module.exports = router;
