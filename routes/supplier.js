const router = require('express').Router();
const suppliersController = require('../controllers/suppliersController');
const validate = require('../utilities/supplier-validation');
router.get('/suppliers', suppliersController.getAllSuppliers);

router.get('/suppliers/:id', suppliersController.getSingleSupplier);

router.post('/suppliers', validate.createSupplier(), validate.checkSupplierData, suppliersController.createSupplier);

router.put('/suppliers/:id', validate.updateSupplier(), validate.checkSupplierUpdateData, suppliersController.updateSupplier);

router.delete('/suppliers/:id', suppliersController.deleteSupplier);   


module.exports = router;