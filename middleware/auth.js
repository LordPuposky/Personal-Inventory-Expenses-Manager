const mongoose = require('mongoose');

// Check if user is authenticated (has valid session)
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    
    // If using session-based auth
    if (req.session && req.session.userId) {
        return next();
    }
    
    return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.'
    });
};

// Check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    
    return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
    });
};

// Validate MongoDB ObjectId
const isValidObjectId = (req, res, next) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID format'
        });
    }
    
    next();
};

module.exports = {
    isAuthenticated,
    isAdmin,
    isValidObjectId
};