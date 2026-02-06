const express = require('express');
const router = express.Router();

// Test route to verify the skeleton works
router.get('/', (req, res) => {
    res.send('PIEM API Skeleton is running');
});

// Link to Swagger
router.use('/', require('./swagger'));

// Inventory routes
router.use('/', require('./inventory'));
// Suppliers routes
router.use('/', require('./supplier'));

module.exports = router;