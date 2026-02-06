const { body, validationResult, param } = require("express-validator")
const validate = {}

// Validation rules for creating a new supplier
validate.createSupplier = () => {
    return [
        body('name')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Supplier name is required')
            .isLength({ min: 2, max: 100 })
            .withMessage('Name must be between 2 and 100 characters long'),
        
        body('email')
            .trim()
            .toLowerCase()
            .isEmail()
            .withMessage('Email must be a valid email address'),
        
        body('phone')
            .trim()
            .notEmpty()
            .withMessage('Phone number is required')
            .matches(/^[0-9\-\+\(\)\s]+$/)
            .withMessage('Phone number format is invalid'),
        
        body('address')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Address is required')
            .isLength({ min: 5, max: 500 })
            .withMessage('Address must be between 5 and 500 characters long'),
        
        body('status')
            .trim()
            .notEmpty()
            .withMessage('Status is required')
            .isIn(['Active', 'Inactive', 'Pending'])
            .withMessage('Status must be one of: Active, Inactive, or Pending'),
        
        body('productsSupplied')
            .trim()
            .notEmpty()
            .withMessage('At least one product must be supplied')
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

// Validation rules for updating a supplier
validate.updateSupplier = () => {
    return [
        body('name')
            .optional()
            .trim()
            .escape()
            .isLength({ min: 2, max: 100 })
            .withMessage('Name must be between 2 and 100 characters long'),
        
        body('email')
            .optional()
            .trim()
            .toLowerCase()
            .isEmail()
            .withMessage('Email must be a valid email address'),
        
        body('phone')
            .optional()
            .trim()
            .matches(/^[0-9\-\+\(\)\s]+$/)
            .withMessage('Phone number format is invalid'),
        
        body('address')
            .optional()
            .trim()
            .escape()
            .isLength({ min: 5, max: 500 })
            .withMessage('Address must be between 5 and 500 characters long'),
        
        body('status')
            .optional()
            .trim()
            .isIn(['Active', 'Inactive', 'Pending'])
            .withMessage('Status must be one of: Active, Inactive, or Pending'),
        
        body('productsSupplied')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('At least one product must be supplied if provided')
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