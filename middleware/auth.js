const { ObjectId } = require('mongodb');

/**
 * Check if user is authenticated (Passport.js)
 * This middleware verifies if the session contains a valid user profile from GitHub.
 */
const isAuthenticated = (req, res, next) => {
    // Passport.js adds the isAuthenticated method to the request object
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }

    // Fallback check for session user object if method is unavailable
    if (req.session && req.session.passport && req.session.passport.user) {
        return next();
    }

    // Return 401 Unauthorized for Week 06 rubric requirements
    return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in via GitHub.'
    });
};

/**
 * Check if user has administrative privileges
 * Used for sensitive routes like deleting users or global settings.
 */
const isAdmin = (req, res, next) => {
    // Note: Week 06 requires basic OAuth; specific role checks are an extra layer
    if (req.user && req.user.role === 'admin') {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
    });
};

/**
 * Validate MongoDB ObjectId
 * Ensures that the ID passed in parameters is a valid 24-character hex string.
 */
const isValidObjectId = (req, res, next) => {
    const { id } = req.params;

    // Using native MongoDB driver check instead of Mongoose for Week 06
    if (!ObjectId.isValid(id)) {
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