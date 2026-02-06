const Category = require('../models/category');
const mongoose = require('mongoose');

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const { active } = req.query;
        let query = {};

        // Filter by active status if provided
        if (active !== undefined) {
            query.isActive = active === 'true';
        }

        const categories = await Category.find(query)
            .populate('createdBy', 'username email')
            .select('-__v')
            .sort({ name: 1 });

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
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category ID format'
            });
        }

        const category = await Category.findById(id)
            .populate('createdBy', 'username email')
            .select('-__v');

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

        // Check if category already exists
        const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (existingCategory) {
            return res.status(409).json({
                success: false,
                message: 'Category with this name already exists'
            });
        }

        // Create new category
        const newCategory = new Category({
            name,
            description: description || '',
            createdBy: req.user.id
        });

        await newCategory.save();

        // Populate createdBy field
        await newCategory.populate('createdBy', 'username email');

        const categoryResponse = newCategory.toObject();
        delete categoryResponse.__v;

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: categoryResponse
        });
    } catch (error) {
        console.error('Error creating category:', error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

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
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category ID format'
            });
        }

        // Find category
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Check if user created this category or is admin
        if (category.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only update categories you created.'
            });
        }

        // Check for duplicate name if name is being updated
        if (updates.name && updates.name !== category.name) {
            const duplicateCategory = await Category.findOne({ 
                name: { $regex: new RegExp(`^${updates.name}$`, 'i') },
                _id: { $ne: id }
            });
            
            if (duplicateCategory) {
                return res.status(409).json({
                    success: false,
                    message: 'Category with this name already exists'
                });
            }
        }

        // Update category
        Object.keys(updates).forEach(key => {
            category[key] = updates[key];
        });

        await category.save();
        
        // Populate createdBy field
        await category.populate('createdBy', 'username email');

        const categoryResponse = category.toObject();
        delete categoryResponse.__v;

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: categoryResponse
        });
    } catch (error) {
        console.error('Error updating category:', error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

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
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category ID format'
            });
        }

        // Find category
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Check if user created this category or is admin
        if (category.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only delete categories you created.'
            });
        }

        // Check if category has items (in real app, you'd check inventory collection)
        if (category.itemCount > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete category with existing items. Remove items first.'
            });
        }

        await Category.findByIdAndDelete(id);

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