// controllers/savingsController.js — stub responses (no database yet)

const getAllSavings = (req, res) => {
    // TODO: replace with database query
    res.json([
      { id: 1, name: 'Vacation Fund', target: 5000, saved: 1000 },
      { id: 2, name: 'Emergency Fund', target: 3000, saved: 500 },
    ]);
  };
  
  const createSavingsGoal = (req, res) => {
    const { name, target } = req.body;
  
    // TODO: replace with database insert
    if (!name || !target) {
      return res.status(400).json({ error: 'Name and target are required' });
    }
  
    res.status(201).json({
      message: 'Savings goal created (stub)',
      data: { id: Date.now(), name, target, saved: 0 },
    });
  };
  
  const deleteSavingsGoal = (req, res) => {
    const { id } = req.params;
  
    // TODO: replace with database delete
    res.json({ message: `Savings goal ${id} deleted (stub)` });
  };
  
  module.exports = { getAllSavings, createSavingsGoal, deleteSavingsGoal };