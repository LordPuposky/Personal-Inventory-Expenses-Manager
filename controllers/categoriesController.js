const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const { active } = req.query;
        let query = {};

        // Filter by active status if provided
        if (active !== undefined) {
            query.isActive = active === 'true';
        }

        const db = mongodb.getDb();
        const categories = await db
            .collection('categories')
            .find(query)
            .sort({ name: 1 })
            .toArray();

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching categories',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get single category by ID
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the ID is valid
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category ID format'
            });
        }

        const db = mongodb.getDb();
        const category = await db
            .collection('categories')
            .findOne({ _id: new ObjectId(id) });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching category',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Create new category
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Validate required fields
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
        }

        const db = mongodb.getDb();

        // Check if category already exists
        const existingCategory = await db
            .collection('categories')
            .findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

        if (existingCategory) {
            return res.status(409).json({
                success: false,
                message: 'Category with this name already exists'
            });
        }

        // Create new category
        const newCategory = {
            name,
            description: description || '',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('categories').insertOne(newCategory);

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            categoryId: result.insertedId.toString()
        });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating category',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update category
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Check if the ID is valid
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category ID format'
            });
        }

        const db = mongodb.getDb();

        // Find category
        const category = await db
            .collection('categories')
            .findOne({ _id: new ObjectId(id) });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Check for duplicate name if name is being updated
        if (updates.name && updates.name !== category.name) {
            const duplicateCategory = await db
                .collection('categories')
                .findOne({
                    name: { $regex: new RegExp(`^${updates.name}$`, 'i') },
                    _id: { $ne: new ObjectId(id) }
                });

            if (duplicateCategory) {
                return res.status(409).json({
                    success: false,
                    message: 'Category with this name already exists'
                });
            }
        }

        // Update category
        const updateData = {
            ...updates,
            updatedAt: new Date()
        };

        await db
            .collection('categories')
            .updateOne(
                { _id: new ObjectId(id) },
                { $set: updateData }
            );

        res.status(200).json({
            success: true,
            message: 'Category updated successfully'
        });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating category',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Delete category
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the ID is valid
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category ID format'
            });
        }

        const db = mongodb.getDb();

        // Find category
        const category = await db
            .collection('categories')
            .findOne({ _id: new ObjectId(id) });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Delete category
        await db
            .collection('categories')
            .deleteOne({ _id: new ObjectId(id) });

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting category',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};