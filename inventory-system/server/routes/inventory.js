const express = require('express');
const router = express.Router();

const {
   getItems,
  getSummary,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getItemQrData
 } = require('../controllers/inventoryController');

// GET all items
router.get('/', getItems);
router.get('/summary', getSummary);

// GET single item
router.get('/:itemId', getItemById);

// CREATE item
router.post('/create', createItem);

// UPDATE item
router.put('/:itemId', updateItem);

// DELETE item
router.delete('/:itemId', deleteItem);
router.get('/:itemId/qr', getItemQrData);

module.exports = router;
