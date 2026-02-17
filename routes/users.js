const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const usersController = require('../controllers/usersController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// Validation rules
const userValidationRules = {
    create: [
        body('username')
            .notEmpty().withMessage('Username is required')
            .isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
            .trim()
            .escape(),
        body('email')
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Invalid email format')
            .normalizeEmail(),
        body('role')
            .optional()
            .isIn(['user', 'admin']).withMessage('Role must be either "user" or "admin"')
    ],
    update: [
        body('username')
            .optional()
            .isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
            .trim()
            .escape(),
        body('email')
            .optional()
            .isEmail().withMessage('Invalid email format')
            .normalizeEmail(),
        body('role')
            .optional()
            .isIn(['user', 'admin']).withMessage('Role must be either "user" or "admin"')
    ]
};

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve all users
 *     description: Get a list of all registered users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully retrieved user list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', usersController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a specific user by ID
 *     description: Retrieve details of a single user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: MongoDB ObjectId of the user
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Successfully retrieved user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid user ID format
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', usersController.getUserById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Register a new user account
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 default: user
 *                 example: user
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error or missing required fields
 *       409:
 *         description: Conflict - User with email or username already exists
 *       500:
 *         description: Internal server error
 */
router.post(
    '/',
    isAuthenticated, isAdmin,
    userValidationRules.create,
    validate,
    usersController.createUser
);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user's profile
 *     description: Update user information
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: MongoDB ObjectId of the user to update
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 example: newusername
 *               email:
 *                 type: string
 *                 format: email
 *                 example: newemail@example.com
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 example: user
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid ID or validation error
 *       404:
 *         description: User not found
 *       409:
 *         description: Conflict - Email or username already exists
 *       500:
 *         description: Internal server error
 */
router.put(
    '/:id',
    isAuthenticated,
    userValidationRules.update,
    validate,
    usersController.updateUser
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user account
 *     description: Permanently delete a user account
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: MongoDB ObjectId of the user to delete
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', isAuthenticated, isAdmin, usersController.deleteUser);

module.exports = router;