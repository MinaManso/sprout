// savings.js — savings modal logic + render + edit/delete + add money

const SAVINGS_KEY = 'savings_goals';
let editingSavingsId = null;
let addMoneyTargetId = null;

function openSavingsModal(id = null) {
  editingSavingsId = id;

  if (id) {
    const goals = Storage.get(SAVINGS_KEY);
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    document.getElementById('savings-name').value = goal.name;
    document.getElementById('savings-target').value = goal.target;
    document.querySelector('#savings-modal .modal-header h2').textContent = 'Edit savings goal';
    document.querySelector('#savings-modal .btn-submit').textContent = 'Save changes';
  } else {
    document.getElementById('savings-form').reset();
    document.querySelector('#savings-modal .modal-header h2').textContent = 'Add savings goal';
    document.querySelector('#savings-modal .btn-submit').textContent = 'Add goal';
  }

  openModal('savings-modal');
}

function openAddMoneyModal(id) {
  addMoneyTargetId = id;
  document.getElementById('add-money-amount').value = '';
  openModal('add-money-modal');
}

function submitSavingsGoal(e) {
  e.preventDefault();

  const name = document.getElementById('savings-name').value.trim();
  const target = parseFloat(document.getElementById('savings-target').value);

  if (!name || isNaN(target) || target <= 0) return;

  if (editingSavingsId) {
    const goals = Storage.get(SAVINGS_KEY);
    const updated = goals.map(g =>
      g.id === editingSavingsId ? { ...g, name, target } : g
    );
    Storage.set(SAVINGS_KEY, updated);
    editingSavingsId = null;
  } else {
    Storage.add(SAVINGS_KEY, { name, target, saved: 0 });
  }

  document.getElementById('savings-form').reset();
  closeModal('savings-modal');
  renderSavings();
  updateTotalSaved();
  if (typeof updateBalanceRemaining === 'function') updateBalanceRemaining();
}

function submitAddMoney(e) {
  e.preventDefault();

  const amount = parseFloat(document.getElementById('add-money-amount').value);
  if (isNaN(amount) || amount <= 0) return;

  const goals = Storage.get(SAVINGS_KEY);
  const updated = goals.map(g =>
    g.id === addMoneyTargetId ? { ...g, saved: g.saved + amount } : g
  );
  Storage.set(SAVINGS_KEY, updated);
  addMoneyTargetId = null;

  document.getElementById('add-money-form').reset();
  closeModal('add-money-modal');
  renderSavings();
  updateTotalSaved();
  if (typeof updateBalanceRemaining === 'function') updateBalanceRemaining();
}

function deleteSavingsGoal(id) {
  if (!confirm('Delete this savings goal?')) return;
  Storage.remove(SAVINGS_KEY, id);
  renderSavings();
  updateTotalSaved();
  if (typeof updateBalanceRemaining === 'function') updateBalanceRemaining();
}

function updateTotalSaved() {
  const goals = Storage.get(SAVINGS_KEY);
  const total = goals.reduce((sum, g) => sum + g.saved, 0);
  const el = document.getElementById('total-saved');
  if (el) el.textContent = '$' + total.toFixed(2);
}

function renderSavings() {
  const goals = Storage.get(SAVINGS_KEY);
  const container = document.getElementById('savings-container');
  if (!container) return;

  if (goals.length === 0) {
    container.innerHTML = '<p style="padding:15px;color:#aaa;text-align:center;">No savings goals yet.</p>';
    return;
  }

  container.innerHTML = goals.map(goal => {
    const pct = Math.min(Math.round((goal.saved / goal.target) * 100), 100);
    return `
      <div style="padding:15px;border-top:1px solid #eee;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <p><strong>${goal.name}</strong>: $${goal.saved.toFixed(2)} / $${goal.target.toFixed(2)}</p>
          <div>
            <button onclick="openAddMoneyModal('${goal.id}')" style="background:#68763E;color:#fff;border:none;border-radius:6px;padding:4px 10px;cursor:pointer;font-size:12px;margin-right:4px;">+ Add Money</button>
            <button onclick="openSavingsModal('${goal.id}')" style="background:none;border:none;color:#68763E;cursor:pointer;font-size:12px;margin-right:4px;">Edit</button>
            <button onclick="deleteSavingsGoal('${goal.id}')" style="background:none;border:none;color:#c0392b;cursor:pointer;font-size:12px;">Delete</button>
          </div>
        </div>
        <div style="background:#e5e5e5;border-radius:99px;height:8px;overflow:hidden;">
          <div style="width:${pct}%;height:100%;background:#68763E;border-radius:99px;transition:width 0.3s ease;"></div>
        </div>
        <p style="font-size:0.85rem;color:#888;margin-top:4px;">${pct}% saved</p>
      </div>
    `;
  }).join('');
}

document.getElementById('savings-form').addEventListener('submit', submitSavingsGoal);
document.getElementById('add-money-form').addEventListener('submit', submitAddMoney);
renderSavings();
updateTotalSaved();