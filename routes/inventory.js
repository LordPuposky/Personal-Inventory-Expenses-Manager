const router = require('express').Router();
const inventoryController = require('../controllers/inventoryController');
const validate = require('../utilities/inventory-validation');

// ============================================
// MY PART: ADDED AUTHENTICATION MIDDLEWARE
// ============================================
const { isAuthenticated } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Inventory management endpoints
 */

/**
 * @swagger
 * /inventory:
 *   get:
 *     summary: Get all inventory items
 *     tags: [Inventory]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Inventory'
 *       401:
 *         description: Not authenticated
 */
// ============================================
// MY PART: ADDED AUTHENTICATION TO GET ALL
// ============================================
router.get('/', isAuthenticated, inventoryController.getAllInventory);

/**
 * @swagger
 * /inventory/{id}:
 *   get:
 *     summary: Get a single inventory item by ID
 *     tags: [Inventory]
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
 *         description: Success
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Item not found
 */
// ============================================
// MY PART: ADDED AUTHENTICATION TO GET SINGLE
// ============================================
router.get('/:id', isAuthenticated, inventoryController.getSingleInventory);

/**
 * @swagger
 * /inventory:
 *   post:
 *     summary: Create a new inventory item
 *     tags: [Inventory]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inventory'
 *     responses:
 *       201:
 *         description: Created
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
    validate.createInventory(), 
    validate.checkInventoryData, 
    inventoryController.createInventory
);

/**
 * @swagger
 * /inventory/{id}:
 *   put:
 *     summary: Update an existing inventory item
 *     tags: [Inventory]
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
 *             $ref: '#/components/schemas/Inventory'
 *     responses:
 *       200:
 *         description: Updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Item not found
 */
// ============================================
// MY PART: ADDED AUTHENTICATION TO PUT
// ============================================
router.put('/:id', 
    isAuthenticated,
    validate.updateInventory(), 
    validate.checkInventoryUpdateData, 
    inventoryController.updateInventory
);

/**
 * @swagger
 * /inventory/{id}:
 *   delete:
 *     summary: Delete an inventory item
 *     tags: [Inventory]
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
 *         description: Deleted
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Item not found
 */
// ============================================
// MY PART: ADDED AUTHENTICATION TO DELETE
// ============================================
router.delete('/:id', isAuthenticated, inventoryController.deleteInventory);

module.exports = router;