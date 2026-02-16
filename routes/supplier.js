const router = require('express').Router();
const suppliersController = require('../controllers/suppliersController');
const validate = require('../utilities/supplier-validation');

// ============================================
// MY PART: ADDED AUTHENTICATION MIDDLEWARE
// ============================================
const { isAuthenticated } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Suppliers
 *   description: Supplier management endpoints
 */

/**
 * @swagger
 * /supplier:
 *   get:
 *     summary: Get all suppliers
 *     tags: [Suppliers]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved supplier list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Supplier'
 *       401:
 *         description: Not authenticated
 */
// ============================================
// MY PART: ADDED AUTHENTICATION TO GET ALL
// ============================================
router.get('/', isAuthenticated, suppliersController.getAllSuppliers);

/**
 * @swagger
 * /supplier/{id}:
 *   get:
 *     summary: Get a single supplier by ID
 *     tags: [Suppliers]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Supplier found
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Supplier not found
 */
// ============================================
// MY PART: ADDED AUTHENTICATION TO GET SINGLE
// ============================================
router.get('/:id', isAuthenticated, suppliersController.getSingleSupplier);

/**
 * @swagger
 * /supplier:
 *   post:
 *     summary: Create a new supplier
 *     tags: [Suppliers]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       201:
 *         description: Supplier created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 */
// ============================================
// MY PART: ADDED AUTHENTICATION TO POST
// ============================================
router.post('/', 
    isAuthenticated,
    validate.createSupplier(), 
    validate.checkSupplierData, 
    suppliersController.createSupplier
);

/**
 * @swagger
 * /supplier/{id}:
 *   put:
 *     summary: Update an existing supplier
 *     tags: [Suppliers]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       200:
 *         description: Supplier updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Supplier not found
 */
// ============================================
// MY PART: ADDED AUTHENTICATION TO PUT
// ============================================
router.put('/:id', 
    isAuthenticated,
    validate.updateSupplier(), 
    validate.checkSupplierUpdateData, 
    suppliersController.updateSupplier
);

/**
 * @swagger
 * /supplier/{id}:
 *   delete:
 *     summary: Delete a supplier
 *     tags: [Suppliers]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Supplier deleted successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Supplier not found
 */
// ============================================
// MY PART: ADDED AUTHENTICATION TO DELETE
// ============================================
router.delete('/:id', isAuthenticated, suppliersController.deleteSupplier);

module.exports = router;