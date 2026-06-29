// server.js — main entry point for Sprout backend

const express = require('express');
const cors = require('cors');

const savingsRoutes = require('./routes/savings');
const expensesRoutes = require('./routes/expenses');
const transactionsRoutes = require('./routes/transactions');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/savings', savingsRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/transactions', transactionsRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Sprout API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});