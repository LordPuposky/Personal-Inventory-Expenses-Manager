const express = require('express');
const router = express.Router();

// Root route to verify API status
router.get('/', (req, res) => {
    res.send('PIEM API is running with all collections');
});

// Uthman's collections: Users and Categories
router.use('/users', require('./users'));
router.use('/categories', require('./categories'));

// Emmanuel's collections: Inventory and Suppliers
router.use('/inventory', require('./inventory'));
router.use('/supplier', require('./supplier'));

module.exports = router;