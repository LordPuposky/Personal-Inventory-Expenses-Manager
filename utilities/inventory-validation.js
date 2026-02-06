const { body, validationResult, param } = require("express-validator")
const validate = {}

validate.createInventory = () => {
    return [
        body('name')
            .isLength({ min: 2, max: 100 })
            .withMessage('Name must be between 2 and 100 characters long'),
        body('category')
            .isLength({ min: 2, max: 100 })
            .withMessage('Category must be between 2 and 100 characters long'),
        body('quantity')
            .isInt({ min: 0 })
            .withMessage('Quantity must be a non-negative integer'),
        body('description')
            .optional()
            .isLength({ max: 500 })
            .withMessage('Description must be less than or equal to 500 characters'),
        body('price')
            .isFloat({ min: 0 })
            .withMessage('Price must be a non-negative number'),
        body('status')
            .isIn(['Available', 'Out of Stock'])
            .withMessage('Status must be one of Available or Out of Stock'),
        body('supplier')
            .isLength({ min: 2, max: 100 })
            .withMessage('Supplier name must be between 2 and 100 characters long')
    ]
};

validate.checkInventoryData= (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

validate.updateInventory = () => {
    return [
        body('name')
            .optional()
            .trim()
            .escape()
            .isLength({ min: 2, max: 100 })
            .withMessage('Name must be between 2 and 100 characters long'),

        body('category')
            .optional()
            .trim()
            .escape()
            .isLength({ min: 2, max: 100 })
            .withMessage('Category must be between 2 and 100 characters long'),

        body('quantity')
            .optional()
            .isInt({ min: 0 })
            .withMessage('Quantity must be a non-negative integer'),

        body('description')
            .optional()
            .trim()
            .escape()
            .isLength({ max: 500 })
            .withMessage('Description must be less than or equal to 500 characters'),
        
        body('price')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Price must be a non-negative number'),

        body('status')
            .optional()
            .isIn(['Available', 'Out of Stock'])
            .withMessage('Status must be one of Available or Out of Stock'),

        body('supplier')
            .optional()
            .trim()
            .escape()
            .isLength({ min: 2, max: 100 })
            .withMessage('Supplier name must be between 2 and 100 characters long')
        
        
    ]

};

validate.checkInventoryUpdateData = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

validate.idParamRule = () => {
    return [
        param('id')
            .isMongoId()
            .withMessage('Invalid ID format')
    ];
};

module.exports = validate;