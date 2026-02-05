const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAllInventory = async (req, res) => {
    try {
        const db = await mongodb.getDb();
        const results = await db.collection('inventory').find().toArray();
        if (results.length === 0) {
            return res.status(404).json({ message: 'No inventory items found' });
        }
        else {
            res.status(200).json(results);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// get a single inventory item by ID
const getSingleInventory = async (req, res) => {

    try {
        const inventoryId = new ObjectId(req.params.id);
        const db = mongodb.getDb();
        const result = await db.collection('inventory').findOne({ _id: inventoryId });

        if (!result) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }

        res.status(200).json(result);
    }   catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createInventory = async (req, res) => {
    try {
        const {
            name,
            category,
            quantity,
            description,
            price,
            status,
            supplier



        } = req.body;

        if (!name || !category || !quantity || !description || !price || !status || !supplier) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const newInventoryItem = {
            name,
            category,
            quantity,
            description,
            price,
            status,
            supplier
        }
        const db = mongodb.getDb();
        const result = await db.collection('inventory').insertOne(newInventoryItem);

        if (result.acknowledged) {
            res.status(201).json({ message: 'Inventory item created successfully', result });
        } else {
            res.status(500).json({ message: 'Failed to create inventory item' });
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }

};

const updateInventory = async (req, res) => {
    try {
        const inventoryId = new ObjectId(req.params.id);
        const updatedInventory = {
            name: req.body.name,
            category: req.body.category,
            quantity: req.body.quantity,
            description: req.body.description,
            price: req.body.price,
            status: req.body.status,
            supplier: req.body.supplier
        };
        const db = mongodb.getDb();
        const result = await db.collection('inventory').replaceOne(
            { _id: inventoryId }, updatedInventory
        );
        if (result.matchedCount > 0) {
            res.status(200).json({ message: 'Inventory item updated successfully' });
        } else {
            res.status(404).json({ message: 'Inventory item not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteInventory = async (req, res) => {
  try {
    const inventoryId = new ObjectId(req.params.id);
    const db = mongodb.getDatabase();
    const result = await db.collection('inventory').deleteOne({ _id: inventoryId });
    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'Inventory item deleted successfully!' });
    } else {
      res.status(404).json({ message: 'Inventory item not found!' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




module.exports = { 
    getAllInventory, 
    getSingleInventory,
    createInventory,
    updateInventory,
    deleteInventory
 };