const { body, validationResult, param } = require("express-validator")
const validate = {}

// Validation rules for creating a new supplier (8 fields)
validate.createSupplier = () => {
    return [
        body('name')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Supplier name is required'),

        body('contactName')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Contact name is required'),

        body('email')
            .trim()
            .toLowerCase()
            .isEmail()
            .withMessage('Valid email is required'),

        body('phone')
            .trim()
            .notEmpty()
            .withMessage('Phone number is required'),

        body('address')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Address is required'),

        body('city')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('City is required'),

        body('state')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('State is required'),

        body('zipCode')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Zip Code is required')
    ]
};

// Middleware to check validation errors
validate.checkSupplierData = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Validation rules for updating a supplier (8 fields optional)
validate.updateSupplier = () => {
    return [
        body('name')
            .optional()
            .trim()
            .escape(),

        body('contactName')
            .optional()
            .trim()
            .escape(),

        body('email')
            .optional()
            .trim()
            .toLowerCase()
            .isEmail()
            .withMessage('Email must be valid if provided'),

        body('phone')
            .optional()
            .trim(),

        body('address')
            .optional()
            .trim()
            .escape(),

        body('city')
            .optional()
            .trim()
            .escape(),

        body('state')
            .optional()
            .trim()
            .escape(),

        body('zipCode')
            .optional()
            .trim()
            .escape()
    ]
};

// Middleware to check update validation errors
validate.checkSupplierUpdateData = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Validation rule for ID parameter
validate.idParamRule = () => {
    return [
        param('id')
            .isMongoId()
            .withMessage('Invalid ID format')
    ];
};

module.exports = validate;