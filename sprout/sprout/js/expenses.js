// expenses.js — budget categories + actual spending + filter/sort

const EXPENSES_KEY = 'expenses';
let editingExpenseId = null;
let expenseFilters = { dateFrom: '', dateTo: '', category: '', minAmount: '', maxAmount: '', sort: '' };

function openExpenseModal(id = null) {
  editingExpenseId = id;

  if (id) {
    const expenses = Storage.get(EXPENSES_KEY);
    const exp = expenses.find(e => e.id === id);
    if (!exp) return;

    document.getElementById('expense-date').value = exp.date;
    document.getElementById('expense-category').value = exp.category;
    document.getElementById('expense-budget').value = exp.budget;
    document.querySelector('#expenses-modal .modal-header h2').textContent = 'Edit expense';
    document.querySelector('#expenses-modal .btn-submit').textContent = 'Save changes';
  } else {
    document.getElementById('expenses-form').reset();
    document.querySelector('#expenses-modal .modal-header h2').textContent = 'Add expense';
    document.querySelector('#expenses-modal .btn-submit').textContent = 'Add expense';
  }

  openModal('expenses-modal');
}

function openExpenseFilter() {
  const expenses = Storage.get(EXPENSES_KEY);
  const categories = [...new Set(expenses.map(e => e.category))];
  const catSelect = document.getElementById('ef-category');
  catSelect.innerHTML = '<option value="">All categories</option>' +
    categories.map(c => `<option value="${c}" ${expenseFilters.category === c ? 'selected' : ''}>${c}</option>`).join('');

  document.getElementById('ef-date-from').value = expenseFilters.dateFrom;
  document.getElementById('ef-date-to').value = expenseFilters.dateTo;
  document.getElementById('ef-min').value = expenseFilters.minAmount;
  document.getElementById('ef-max').value = expenseFilters.maxAmount;
  document.getElementById('ef-sort').value = expenseFilters.sort;

  openModal('expense-filter-modal');
}

function applyExpenseFilter() {
  expenseFilters = {
    dateFrom: document.getElementById('ef-date-from').value,
    dateTo: document.getElementById('ef-date-to').value,
    category: document.getElementById('ef-category').value,
    minAmount: document.getElementById('ef-min').value,
    maxAmount: document.getElementById('ef-max').value,
    sort: document.getElementById('ef-sort').value,
  };
  closeModal('expense-filter-modal');
  renderExpenses();
}

function clearExpenseFilter() {
  expenseFilters = { dateFrom: '', dateTo: '', category: '', minAmount: '', maxAmount: '', sort: '' };
  closeModal('expense-filter-modal');
  renderExpenses();
}

function submitExpense(e) {
  e.preventDefault();

  const date = document.getElementById('expense-date').value;
  const category = document.getElementById('expense-category').value.trim();
  const budget = parseFloat(document.getElementById('expense-budget').value);

  if (!date || !category || isNaN(budget) || budget <= 0) return;

  if (editingExpenseId) {
    const expenses = Storage.get(EXPENSES_KEY);
    const updated = expenses.map(exp =>
      exp.id === editingExpenseId ? { ...exp, date, category, budget } : exp
    );
    Storage.set(EXPENSES_KEY, updated);
    editingExpenseId = null;
  } else {
    Storage.add(EXPENSES_KEY, { date, category, budget });
  }

  document.getElementById('expenses-form').reset();
  closeModal('expenses-modal');
  renderExpenses();
  updateBalanceRemaining();

  if (typeof populateCategories === 'function') populateCategories();
}

function deleteExpense(id) {
  if (!confirm('Delete this expense budget?')) return;
  Storage.remove(EXPENSES_KEY, id);
  renderExpenses();
  updateBalanceRemaining();

  if (typeof populateCategories === 'function') populateCategories();
}

function getActualForCategory(category) {
  const transactions = Storage.get('transactions');
  return transactions
    .filter(tx => tx.category === category)
    .reduce((sum, tx) => sum + tx.amount, 0);
}

function updateBalanceRemaining() {
  const expenses = Storage.get(EXPENSES_KEY);
  const transactions = Storage.get('transactions');
  const savings = Storage.get('savings_goals');

  const totalBudget = expenses.reduce((sum, exp) => sum + exp.budget, 0);
  const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const totalSaved = savings.reduce((sum, g) => sum + g.saved, 0);

  const remaining = totalBudget - totalSpent - totalSaved;

  const el = document.getElementById('balance-remaining');
  if (el) {
    el.textContent = '$' + remaining.toFixed(2);
    el.style.color = remaining < 0 ? '#c0392b' : 'inherit';
  }
}

function renderExpenses() {
  let expenses = Storage.get(EXPENSES_KEY);
  const tbody = document.getElementById('expenses-tbody');
  if (!tbody) return;

  // Apply filters
  if (expenseFilters.dateFrom) expenses = expenses.filter(e => e.date >= expenseFilters.dateFrom);
  if (expenseFilters.dateTo) expenses = expenses.filter(e => e.date <= expenseFilters.dateTo);
  if (expenseFilters.category) expenses = expenses.filter(e => e.category === expenseFilters.category);
  if (expenseFilters.minAmount) expenses = expenses.filter(e => e.budget >= parseFloat(expenseFilters.minAmount));
  if (expenseFilters.maxAmount) expenses = expenses.filter(e => e.budget <= parseFloat(expenseFilters.maxAmount));

  // Apply sort
  if (expenseFilters.sort === 'low') expenses = [...expenses].sort((a, b) => a.budget - b.budget);
  if (expenseFilters.sort === 'high') expenses = [...expenses].sort((a, b) => b.budget - a.budget);

  if (expenses.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#aaa;">No expense budgets found.</td></tr>';
    return;
  }

  tbody.innerHTML = expenses.map(exp => {
    const actual = getActualForCategory(exp.category);
    const over = actual > exp.budget;
    return `
      <tr>
        <td>${exp.date}</td>
        <td>${exp.category}</td>
        <td>$${exp.budget.toFixed(2)}</td>
        <td style="color:${over ? '#c0392b' : 'inherit'}">$${actual.toFixed(2)}</td>
        <td>
          <button onclick="openExpenseModal('${exp.id}')" style="background:none;border:none;color:#68763E;cursor:pointer;font-size:12px;margin-right:6px;">Edit</button>
          <button onclick="deleteExpense('${exp.id}')" style="background:none;border:none;color:#c0392b;cursor:pointer;font-size:12px;">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

document.getElementById('expenses-form').addEventListener('submit', submitExpense);
renderExpenses();
updateBalanceRemaining();