const router = require('express').Router();
const suppliersController = require('../controllers/suppliersController');
const validate = require('../utilities/supplier-validation');

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
 *     responses:
 *       200:
 *         description: Successfully retrieved supplier list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Supplier'
 */
router.get('/', suppliersController.getAllSuppliers);

/**
 * @swagger
 * /supplier/{id}:
 *   get:
 *     summary: Get a single supplier by ID
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Supplier found
 *       404:
 *         description: Supplier not found
 */
router.get('/:id', suppliersController.getSingleSupplier);

/**
 * @swagger
 * /supplier:
 *   post:
 *     summary: Create a new supplier
 *     tags: [Suppliers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       201:
 *         description: Supplier created successfully
 */
router.post('/', validate.createSupplier(), validate.checkSupplierData, suppliersController.createSupplier);

/**
 * @swagger
 * /supplier/{id}:
 *   put:
 *     summary: Update an existing supplier
 *     tags: [Suppliers]
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
 *       204:
 *         description: Supplier updated successfully
 */
router.put('/:id', validate.updateSupplier(), validate.checkSupplierUpdateData, suppliersController.updateSupplier);

/**
 * @swagger
 * /supplier/{id}:
 *   delete:
 *     summary: Delete a supplier
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Supplier deleted successfully
 */
router.delete('/:id', suppliersController.deleteSupplier);

module.exports = router;
