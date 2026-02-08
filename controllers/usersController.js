const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');
// const User = require('../models/user'); // Mongoose is not used in Week 05

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
    try {
        // Check if user is admin
        // ⚠️ WEEK 06: Authentication and req.user will be active in Week 06
        /*
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }
        */

        // ⚠️ WEEK 05: Using native MongoDB driver instead of Mongoose (User.find)
        const db = mongodb.getDb();
        const users = await db.collection('users').find().toArray();

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching users',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get single user by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the ID is valid
        // ⚠️ WEEK 05: Using ObjectId.isValid from mongodb driver
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format'
            });
        }

        // ⚠️ WEEK 05: Using native findOne instead of User.findById
        const db = mongodb.getDb();
        const user = await db.collection('users').findOne({ _id: new ObjectId(id) });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching user',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Create new user
const createUser = async (req, res) => {
    try {
        const { username, email, role, firstName, lastName } = req.body;

        // ⚠️ WEEK 05: Using native insertOne instead of User.create
        const db = mongodb.getDb();
        const newUser = {
            username,
            email,
            role: role || 'user',
            firstName,
            lastName,
            createdAt: new Date()
        };

        const result = await db.collection('users').insertOne(newUser);

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            userId: result.insertedId.toString()
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating user',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update user profile
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // ⚠️ WEEK 05: Using ObjectId.isValid
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format'
            });
        }

        // ⚠️ WEEK 05: Using native updateOne instead of User.findByIdAndUpdate
        const db = mongodb.getDb();
        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...updates, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User updated successfully'
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating user',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if user is admin
        // ⚠️ WEEK 06: Admin authentication required
        /*
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }
        */

        // Check if the ID is valid
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format'
            });
        }

        // Prevent self-deletion
        // ⚠️ WEEK 06: Identity check requires req.user
        /*
        if (req.user.id === id) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own account'
            });
        }
        */

        // ⚠️ WEEK 05: Using native deleteOne instead of User.findByIdAndDelete
        const db = mongodb.getDb();
        const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting user',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};