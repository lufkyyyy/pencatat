// Expense/Income Tracker App
// Uses localStorage for persistence

let records = JSON.parse(localStorage.getItem('financialRecords')) || [];

const form = document.getElementById('recordForm');
const tableBody = document.getElementById('recordsTableBody');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpenseEl = document.getElementById('totalExpense');
  const tabunganEl = document.getElementById('balance');
const clearBtn = document.getElementById('clearAll');

document.addEventListener('DOMContentLoaded', function() {
  // Auto-set date to today
  const dateInput = document.getElementById('date');
  if (dateInput) {
    dateInput.valueAsDate = new Date();
  }
  
  renderTable();
  updateSummary();
});

form.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const type = document.getElementById('type').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const description = document.getElementById('description').value;
  const date = document.getElementById('date').value;
  
  if (!amount || !description || !date) {
    alert('Mohon isi semua field!');
    return;
  }
  
  const record = {
    id: Date.now(),
    type,
    amount,
    description,
    date,
    className: type === 'income' ? 'income' : 'expense'
  };
  
  records.unshift(record); // Add to beginning for latest first
  saveRecords();
  renderTable();
  updateSummary();
  form.reset();
  document.getElementById('date').valueAsDate = new Date(); // Reset date to today
});

clearBtn.addEventListener('click', function() {
  if (confirm('Yakin ingin hapus semua data?')) {
    records = [];
    saveRecords();
    renderTable();
    updateSummary();
  }
});

function renderTable() {
  tableBody.innerHTML = '';
  records.forEach(record => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${new Date(record.date).toLocaleDateString('id-ID')}</td>
      <td class="${record.className}">Rp ${record.amount.toLocaleString('id-ID')}</td>
      <td class="${record.className}">${record.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}</td>
      <td>${record.description}</td>
    `;
    tableBody.appendChild(row);
  });
}

function updateSummary() {
  const income = records
    .filter(r => r.type === 'income')
    .reduce((sum, r) => sum + r.amount, 0);
  const expense = records
    .filter(r => r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0);
  const tabungan = income - expense;
  
  totalIncomeEl.textContent = `Rp ${income.toLocaleString('id-ID')}`;
  totalExpenseEl.textContent = `Rp ${expense.toLocaleString('id-ID')}`;
  tabunganEl.textContent = `Rp ${tabungan.toLocaleString('id-ID')}`;
}

function saveRecords() {
  localStorage.setItem('financialRecords', JSON.stringify(records));
}

