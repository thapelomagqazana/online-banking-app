// Select elements
const loginBtn = document.body.querySelector(".login-button");
const usernameInput = document.body.querySelector("#username");
const pinInput = document.body.querySelector("#pin");

const userNameDisplay = document.body.querySelector("#user-name");
const balanceDisplay = document.body.querySelector("#balance");
const transactionList = document.body.querySelector("#transaction-list");
const loginSection = document.body.querySelector(".login-container");
const accountOverview = document.body.querySelector(".account-overview");

// Dummy data
const users = [
  {
    username: "john",
    pin: "1111",
    balance: 1500,
    transactions: [
      { amount: 500, date: "2024-09-01" },
      { amount: -200, date: "2024-09-02" },
      { amount: 100, date: "2024-09-03" },
      { amount: -50, date: "2024-09-04" },
    ],
  },
  {
    username: "peter",
    pin: "2222",
    balance: 3000,
    transactions: [
      { amount: 1000, date: "2024-09-01" },
      { amount: -500, date: "2024-09-02" },
      { amount: 200, date: "2024-09-03" },
    ],
  },
];

let currentUser;

// Handle login
loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const username = usernameInput.value;
  const pin = pinInput.value;

  // Find user
  currentUser = users.find(
    (user) => username === user.username && pin === user.pin
  );

  if (currentUser) {
    loginSection.hidden = true;
    accountOverview.hidden = false;
    userNameDisplay.textContent = currentUser.username;
    balanceDisplay.textContent = currentUser.balance.toFixed(2);
    renderTransactions(currentUser.transactions);
  } else {
    alert("Invalid username or PIN");
  }
});

// Render transactions
function renderTransactions(transactions) {
  transactionList.innerHTML = ""; // Clear existing transactions
  transactions.forEach((transaction, index) => {
    const li = document.createElement("li");
    li.classList.add("transaction");

    // Add deposit or withdrawal class based on amount
    if (transaction.amount > 0) {
      li.classList.add("deposit");
    } else {
      li.classList.add("withdrawal");
    }

    li.innerHTML = `Transaction ${index + 1}: ${
      transaction.amount > 0 ? "+" : ""
    }${transaction.amount} 
    <span class="transaction-date">(${transaction.date})</span>`;

    transactionList.appendChild(li);
  });
}
