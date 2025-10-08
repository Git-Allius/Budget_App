const paycheckForm = document.getElementById('paycheck-form');
const deductForm = document.getElementById('deduct-form');
const balancesList = document.getElementById('balances');

let categories = JSON.parse(localStorage.getItem('categories')) || {
  emergency: 0,
  food: 0,
  medical: 0,
  transportation: 0,
  civic: 0,
  internet: 0,
  other: 0,
  girlfriend: 0,
  marriage: 0,
  savings: 0,
  investment: 0,
  pocket: 0
};

function updateDisplay() {
    balancesList.innerHTML = '';
  
    let total = 0;
    for (const [key, value] of Object.entries(categories)) {
      total += value;
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${key.charAt(0).toUpperCase() + key.slice(1)}</span>
        <strong>$${value.toFixed(2)}</strong>
      `;
      balancesList.appendChild(li);
    }
  
    // Update total income display
    const totalDisplay = document.querySelector('#total-income strong');
    totalDisplay.textContent = `$${total.toFixed(2)}`;
  
    // Save to localStorage
    localStorage.setItem('categories', JSON.stringify(categories));
  }

// Allocate paycheck based on percentage inputs
paycheckForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const paycheck = parseFloat(document.getElementById('paycheck').value);
  const percentages = {
    emergency: +document.getElementById('emergencyPercent').value,
    food: +document.getElementById('foodPercent').value,
    medical: +document.getElementById('medicalPercent').value,
    transportation: +document.getElementById('transportPercent').value,
    civic: +document.getElementById('civicPercent').value,
    internet: +document.getElementById('internetPercent').value,
    other: +document.getElementById('otherPercent').value,
    girlfriend: +document.getElementById('girlfriendPercent').value,
    marriage: +document.getElementById('marriagePercent').value,
    savings: +document.getElementById('savingPercent').value,
    investment: +document.getElementById('investmentPercent').value,
    pocket: +document.getElementById('pocketPercent').value
  };

  const totalPercent = Object.values(percentages).reduce((a, b) => a + b, 0);
  if (Math.abs(totalPercent - 100) > 0.01) {
    alert('Percentages must add up to 100%');
    return;
  }

  for (const key in percentages) {
    const addAmount = (paycheck * percentages[key]) / 100;
    categories[key] += addAmount;
  }

  updateDisplay();
  paycheckForm.reset();
});

// Deduct expense from category
deductForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const category = document.getElementById('category').value;
  const amount = parseFloat(document.getElementById('deductAmount').value);

  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid amount.');
    return;
  }

  if (!categories.hasOwnProperty(category)) {
    alert('Invalid category selected.');
    return;
  }

  if (amount > categories[category]) {
    alert('Not enough funds in this category!');
    return;
  }

  categories[category] -= amount;
  updateDisplay();
  deductForm.reset();
});

// Reset all balances
document.getElementById('resetButton').addEventListener('click', () => {
    const confirmReset = confirm('Are you sure you want to reset all balances to $0?');
    if (!confirmReset) return;
  
    for (const key in categories) {
      categories[key] = 0;
    }
  
    localStorage.removeItem('categories');
    updateDisplay();
    alert('All balances have been reset!');
  });

updateDisplay();
