const express = require('express');
const router = express.Router();

const {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} = require('../controllers/inventoryController');

// GET all items
router.get('/', getItems);

// GET single item
router.get('/:itemId', getItemById);

// CREATE item
router.post('/create', createItem);

// UPDATE item
router.put('/:itemId', updateItem);

// DELETE item
router.delete('/:itemId', deleteItem);

module.exports = router;