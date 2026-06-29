const express = require('express');
const router = express.Router();
const savingsController = require('../controllers/savingsController');

router.get('/', savingsController.getAllSavings);
router.post('/', savingsController.createSavingsGoal);
router.delete('/:id', savingsController.deleteSavingsGoal);

module.exports = router;