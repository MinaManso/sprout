// controllers/expensesController.js — stub responses (no database yet)

const getAllExpenses = (req, res) => {
    // TODO: replace with database query
    res.json([
      { id: 1, name: 'Rent', amount: 1500.00, date: '2026-06-01' },
      { id: 2, name: 'Groceries', amount: 245.00, date: '2026-06-30' },
    ]);
  };
  
  const createExpense = (req, res) => {
    const { name, amount, date } = req.body;
  
    // TODO: replace with database insert
    if (!name || !amount || !date) {
      return res.status(400).json({ error: 'Name, amount, and date are required' });
    }
  
    res.status(201).json({
      message: 'Expense created (stub)',
      data: { id: Date.now(), name, amount, date },
    });
  };
  
  const deleteExpense = (req, res) => {
    const { id } = req.params;
  
    // TODO: replace with database delete
    res.json({ message: `Expense ${id} deleted (stub)` });
  };
  
  module.exports = { getAllExpenses, createExpense, deleteExpense };