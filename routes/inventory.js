const router = require('express').Router();
const inventoryController = require('../controllers/inventoryController');
const validate = require('../utilities/inventory-validation');

router.get('/inventory', inventoryController.getAllInventory);

router.get('/inventory/:id', inventoryController.getSingleInventory);

router.post('/inventory', validate.createInventory(), validate.checkInventoryData, inventoryController.createInventory);

router.put('/inventory/:id', validate.updateInventory(), validate.checkInventoryUpdateData, inventoryController.updateInventory);

router.delete('/inventory/:id', inventoryController.deleteInventory);   


module.exports = router;