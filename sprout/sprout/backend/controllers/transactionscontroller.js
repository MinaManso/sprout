// controllers/transactionsController.js — stub responses (no database yet)

const getAllTransactions = (req, res) => {
    // TODO: replace with database query
    res.json([
      { id: 1, name: 'Rent', category: 'Housing', amount: 1500.00, date: '2026-06-01' },
      { id: 2, name: 'Costco', category: 'Food', amount: 250.00, date: '2026-06-03' },
      { id: 3, name: 'Bus Pass', category: 'Transport', amount: 80.00, date: '2026-06-05' },
    ]);
  };
  
  const createTransaction = (req, res) => {
    const { name, category, amount, date } = req.body;
  
    // TODO: replace with database insert
    if (!name || !category || !amount || !date) {
      return res.status(400).json({ error: 'Name, category, amount, and date are required' });
    }
  
    res.status(201).json({
      message: 'Transaction created (stub)',
      data: { id: Date.now(), name, category, amount, date },
    });
  };
  
  const deleteTransaction = (req, res) => {
    const { id } = req.params;
  
    // TODO: replace with database delete
    res.json({ message: `Transaction ${id} deleted (stub)` });
  };
  
  module.exports = { getAllTransactions, createTransaction, deleteTransaction };