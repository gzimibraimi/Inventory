const express = require('express');
const multer = require('multer');
const {
  getItems,
  importItems,
  assignItem,
  returnItem,
  getSummary,
  getReversPdf,
  seedData,
  createItem,
  getitemHistory,
  getItemById,
  updateItem,
  deleteItem,
  exportItems,
} = require('../controllers/inventoryController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', getItems);
router.get('/summary', getSummary);
router.get('/export', exportItems);
router.post('/create', createItem);
router.get('/:itemId', getItemById);
router.get('/:itemId/history', getitemHistory);
router.put('/:itemId', updateItem);
router.delete('/:itemId', deleteItem);
router.post('/import', upload.single('file'), importItems);
router.post('/seed', seedData);
router.post('/assign', assignItem);
router.post('/return', returnItem);
router.get('/revers/:itemId', getReversPdf);

module.exports = router;
