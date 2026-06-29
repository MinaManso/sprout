const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactionsController');

router.get('/', transactionsController.getAllTransactions);
router.post('/', transactionsController.createTransaction);
router.delete('/:id', transactionsController.deleteTransaction);

module.exports = router;