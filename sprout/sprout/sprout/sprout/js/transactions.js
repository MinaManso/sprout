// transactions.js — transaction modal logic + render + edit/delete + filter/sort

const TRANSACTIONS_KEY = 'transactions';
let editingTransactionId = null;
let transactionFilters = { dateFrom: '', dateTo: '', category: '', minAmount: '', maxAmount: '', sort: '' };

function populateCategories(selectedCategory = '') {
  const select = document.getElementById('transaction-category');
  const expenses = Storage.get('expenses');
  const categories = expenses.map(e => e.category);

  if (categories.length === 0) {
    select.innerHTML = '<option value="">No expense categories yet</option>';
    return;
  }

  select.innerHTML = '<option value="">Select category</option>' +
    categories.map(c => `<option value="${c}" ${c === selectedCategory ? 'selected' : ''}>${c}</option>`).join('');
}

function openTransactionModal(id = null) {
  editingTransactionId = id;

  if (id) {
    const transactions = Storage.get(TRANSACTIONS_KEY);
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;

    document.getElementById('transaction-date').value = tx.date;
    populateCategories(tx.category);
    document.getElementById('transaction-name').value = tx.name;
    document.getElementById('transaction-amount').value = tx.amount;
    document.querySelector('#transactions-modal .modal-header h2').textContent = 'Edit transaction';
    document.querySelector('#transactions-modal .btn-submit').textContent = 'Save changes';
  } else {
    document.getElementById('transactions-form').reset();
    populateCategories();
    document.querySelector('#transactions-modal .modal-header h2').textContent = 'Add transaction';
    document.querySelector('#transactions-modal .btn-submit').textContent = 'Add transaction';
  }

  openModal('transactions-modal');
}

function openTransactionFilter() {
  const expenses = Storage.get('expenses');
  const categories = expenses.map(e => e.category);
  const catSelect = document.getElementById('tf-category');
  catSelect.innerHTML = '<option value="">All categories</option>' +
    categories.map(c => `<option value="${c}" ${transactionFilters.category === c ? 'selected' : ''}>${c}</option>`).join('');

  document.getElementById('tf-date-from').value = transactionFilters.dateFrom;
  document.getElementById('tf-date-to').value = transactionFilters.dateTo;
  document.getElementById('tf-min').value = transactionFilters.minAmount;
  document.getElementById('tf-max').value = transactionFilters.maxAmount;
  document.getElementById('tf-sort').value = transactionFilters.sort;

  openModal('transaction-filter-modal');
}

function applyTransactionFilter() {
  transactionFilters = {
    dateFrom: document.getElementById('tf-date-from').value,
    dateTo: document.getElementById('tf-date-to').value,
    category: document.getElementById('tf-category').value,
    minAmount: document.getElementById('tf-min').value,
    maxAmount: document.getElementById('tf-max').value,
    sort: document.getElementById('tf-sort').value,
  };
  closeModal('transaction-filter-modal');
  renderTransactions();
}

function clearTransactionFilter() {
  transactionFilters = { dateFrom: '', dateTo: '', category: '', minAmount: '', maxAmount: '', sort: '' };
  closeModal('transaction-filter-modal');
  renderTransactions();
}

function submitTransaction(e) {
  e.preventDefault();

  const date = document.getElementById('transaction-date').value;
  const category = document.getElementById('transaction-category').value;
  const name = document.getElementById('transaction-name').value.trim();
  const amount = parseFloat(document.getElementById('transaction-amount').value);

  if (!date || !category || !name || isNaN(amount) || amount <= 0) return;

  if (editingTransactionId) {
    const transactions = Storage.get(TRANSACTIONS_KEY);
    const updated = transactions.map(tx =>
      tx.id === editingTransactionId ? { ...tx, date, category, name, amount } : tx
    );
    Storage.set(TRANSACTIONS_KEY, updated);
    editingTransactionId = null;
  } else {
    Storage.add(TRANSACTIONS_KEY, { date, category, name, amount });
  }

  document.getElementById('transactions-form').reset();
  populateCategories();
  closeModal('transactions-modal');
  renderTransactions();
  updateTotalSpent();
  if (typeof updateBalanceRemaining === 'function') updateBalanceRemaining();
  if (typeof renderExpenses === 'function') renderExpenses();
}

function deleteTransaction(id) {
  if (!confirm('Delete this transaction?')) return;
  Storage.remove(TRANSACTIONS_KEY, id);
  renderTransactions();
  updateTotalSpent();
  if (typeof updateBalanceRemaining === 'function') updateBalanceRemaining();
  if (typeof renderExpenses === 'function') renderExpenses();
}

function updateTotalSpent() {
  const transactions = Storage.get(TRANSACTIONS_KEY);
  const total = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const el = document.getElementById('total-spent');
  if (el) el.textContent = '$' + total.toFixed(2);
}

function renderTransactions() {
  let transactions = Storage.get(TRANSACTIONS_KEY);
  const tbody = document.getElementById('transactions-tbody');
  if (!tbody) return;

  // Apply filters
  if (transactionFilters.dateFrom) transactions = transactions.filter(tx => tx.date >= transactionFilters.dateFrom);
  if (transactionFilters.dateTo) transactions = transactions.filter(tx => tx.date <= transactionFilters.dateTo);
  if (transactionFilters.category) transactions = transactions.filter(tx => tx.category === transactionFilters.category);
  if (transactionFilters.minAmount) transactions = transactions.filter(tx => tx.amount >= parseFloat(transactionFilters.minAmount));
  if (transactionFilters.maxAmount) transactions = transactions.filter(tx => tx.amount <= parseFloat(transactionFilters.maxAmount));

  // Apply sort
  if (transactionFilters.sort === 'low') transactions = [...transactions].sort((a, b) => a.amount - b.amount);
  if (transactionFilters.sort === 'high') transactions = [...transactions].sort((a, b) => b.amount - a.amount);

  if (transactions.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#aaa;">No transactions found.</td></tr>';
    return;
  }

  tbody.innerHTML = transactions.map(tx => `
    <tr>
      <td>${tx.date}</td>
      <td>${tx.category}</td>
      <td>${tx.name}</td>
      <td>$${tx.amount.toFixed(2)}</td>
      <td>
        <button onclick="openTransactionModal('${tx.id}')" style="background:none;border:none;color:#68763E;cursor:pointer;font-size:12px;margin-right:6px;">Edit</button>
        <button onclick="deleteTransaction('${tx.id}')" style="background:none;border:none;color:#c0392b;cursor:pointer;font-size:12px;">Delete</button>
      </td>
    </tr>
  `).join('');
}

populateCategories();
document.getElementById('transactions-form').addEventListener('submit', submitTransaction);
renderTransactions();
updateTotalSpent();