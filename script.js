const paycheckForm = document.getElementById("paycheck-form");
const deductForm = document.getElementById("deduct-form");
const balancesList = document.getElementById("balances");

const totalBalanceEl = document.getElementById("totalBalance");
const futureTotalEl = document.getElementById("futureTotal");
const spendingTotalEl = document.getElementById("spendingTotal");

const STORAGE_KEY = "budgetCategories";

// Default structure
const defaultCategories = {
  emergency: 0,
  food: 0,
  medical: 0,
  transportation: 0,
  civic: 0,
  internet: 0,
  other: 0,
  layla: 0,
  marriage: 0,
  savings: 0,
  investment: 0,
  pocket: 0
};

let categories = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultCategories;

// Save to localStorage
function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
}

// Format currency
function formatMoney(amount) {
  return `$${amount.toFixed(2)}`;
}

// Update UI
function updateDisplay() {
  balancesList.innerHTML = "";

  let total = 0;
  let futureTotal = 0;
  let spendingTotal = 0;

  Object.entries(categories).forEach(([key, value]) => {
    value = Number(value);

    total += value;

    if (["savings", "marriage", "investment"].includes(key)) {
      futureTotal += value;
    } else {
      spendingTotal += value;
    }

    const li = document.createElement("li");
    li.innerHTML = `
      <span>${key.charAt(0).toUpperCase() + key.slice(1)}</span>
      <strong>${formatMoney(value)}</strong>
    `;
    balancesList.appendChild(li);
  });

  totalBalanceEl.textContent = formatMoney(total);
  futureTotalEl.textContent = formatMoney(futureTotal);
  spendingTotalEl.textContent = formatMoney(spendingTotal);

  saveToStorage();
}

// Allocate paycheck
paycheckForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const paycheck = parseFloat(document.getElementById("paycheck").value);

  if (isNaN(paycheck) || paycheck <= 0) {
    alert("Enter a valid paycheck amount.");
    return;
  }

  const percentages = {
    emergency: +document.getElementById("emergencyPercent").value,
    food: +document.getElementById("foodPercent").value,
    medical: +document.getElementById("medicalPercent").value,
    transportation: +document.getElementById("transportPercent").value,
    civic: +document.getElementById("civicPercent").value,
    internet: +document.getElementById("internetPercent").value,
    other: +document.getElementById("otherPercent").value,
    layla: +document.getElementById("laylaPercent").value,
    marriage: +document.getElementById("marriagePercent").value,
    savings: +document.getElementById("savingPercent").value,
    investment: +document.getElementById("investmentPercent").value,
    pocket: +document.getElementById("pocketPercent").value
  };

  const totalPercent = Object.values(percentages).reduce((a, b) => a + b, 0);

  if (Math.abs(totalPercent - 100) > 0.01) {
    alert("Percentages must equal 100%");
    return;
  }

  for (const key in percentages) {
    categories[key] += (paycheck * percentages[key]) / 100;
  }

  paycheckForm.reset();
  updateDisplay();
});

// Deduct expense
deductForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const category = document.getElementById("category").value;
  const amount = parseFloat(document.getElementById("deductAmount").value);

  if (isNaN(amount) || amount <= 0) {
    alert("Enter a valid amount.");
    return;
  }

  if (amount > categories[category]) {
    alert("Not enough funds in this category.");
    return;
  }

  categories[category] -= amount;

  deductForm.reset();
  updateDisplay();
});

// Reset all
document.getElementById("resetButton").addEventListener("click", () => {
  if (!confirm("Reset all balances to $0?")) return;

  categories = { ...defaultCategories };
  localStorage.removeItem(STORAGE_KEY);
  updateDisplay();
});

// Initial load
updateDisplay();