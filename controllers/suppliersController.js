const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAllSuppliers = async (req, res) => {
    try {
        const db = await mongodb.getDb();
        const results = await db.collection('suppliers').find().toArray();
        if (results.length === 0) {
            return res.status(404).json({ message: 'No suppliers found' });
        }
        else {
            res.status(200).json(results);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// get a single supplier by ID
const getSingleSupplier = async (req, res) => {

    try {
        const supplierId = new ObjectId(req.params.id);
        const db = mongodb.getDb();
        const result = await db.collection('suppliers').findOne({ _id: supplierId });

        if (!result) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        res.status(200).json(result);
    }   catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createSupplier = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            address,
            status,
            productsSupplied



        } = req.body;

        if (!name || !email || !phone || !address || !status || !productsSupplied) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const newSupplier = {
            name,
            email,
            phone,
            address,
            status,
            productsSupplied
        }
        const db = mongodb.getDb();
        const result = await db.collection('suppliers').insertOne(newSupplier);

        if (result.acknowledged) {
            res.status(201).json({ message: 'Supplier created successfully', result });
        } else {
            res.status(500).json({ message: 'Failed to create supplier' });
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }

};

const updateSupplier = async (req, res) => {
    try {
        const supplierId = new ObjectId(req.params.id);
        const updatedSupplier = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            status: req.body.status,
            productsSupplied: req.body.productsSupplied
        };
        const db = mongodb.getDb();
        const result = await db.collection('suppliers').replaceOne(
            { _id: supplierId }, updatedSupplier
        );
        if (result.matchedCount > 0) {
            res.status(200).json({ message: 'Supplier updated successfully' });
        } else {
            res.status(404).json({ message: 'Supplier not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteSupplier = async (req, res) => {
  try {
    const supplierId = new ObjectId(req.params.id);
    const db = mongodb.getDb();
    const result = await db.collection('suppliers').deleteOne({ _id: supplierId });
    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'Supplier deleted successfully!' });
    } else {
      res.status(404).json({ message: 'Supplier not found!' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




module.exports = { 
    getAllSuppliers, 
    getSingleSupplier,
    createSupplier,
    updateSupplier,
    deleteSupplier
 };
           




