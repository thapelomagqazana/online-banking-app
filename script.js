// Select elements
const loginBtn = document.body.querySelector(".login-button");
const logoutBtn = document.body.querySelector(".logout-btn");
const usernameInput = document.body.querySelector("#username");
const pinInput = document.body.querySelector("#pin");

const userNameDisplay = document.body.querySelector("#user-name");
const balanceDisplay = document.body.querySelector("#balance");
const transactionList = document.body.querySelector("#transaction-list");
const loginSection = document.body.querySelector(".login-container");
const accountOverview = document.body.querySelector(".account-overview");

const totalDepositsDisplay = document.body.querySelector("#total-deposits");
const totalWithdrawalsDisplay =
  document.body.querySelector("#total-withdrawals");

const transferModal = document.body.querySelector("#transfer-modal");
const transferForm = document.body.querySelector("#transfer-form");
const transferBtn = document.body.querySelector(".transfer-btn");
const requestBtn = document.body.querySelector(".request-loan");
const requestLoanModal = document.body.querySelector("#request-loan-modal");
const requestLoanForm = document.body.querySelector("#request-loan-form");
const closeModalBtn = document.body.querySelector(".close-btn");
const loanCloseBtn = document.body.querySelector(".loan-close");
const recipientUsernameInput = document.body.querySelector("#recipient");
const amountInput = document.body.querySelector("#amount");
const loanAmountInput = document.body.querySelector("#loan-amount");
const transferSubmitBtn = document.body.querySelector(".transfer-submit");
const loanSubmitBtn = document.body.querySelector(".loan-submit");

// Dummy data
const users = [
  {
    username: "john",
    pin: "1111",
    balance: 1500,
    transactions: [
      { amount: 500, date: "2024/09/01" },
      { amount: -200, date: "2024/09/02" },
      { amount: 100, date: "2024/09/03" },
      { amount: -50, date: "2024/09/04" },
    ],
  },
  {
    username: "peter",
    pin: "2222",
    balance: 3000,
    transactions: [
      { amount: 1000, date: "2024/09/01" },
      { amount: -500, date: "2024/09/02" },
      { amount: 200, date: "2024/09/03" },
    ],
  },
];

let currentUser;

// Utility functions
const toggleVisibility = (element, isVisible) => {
  if (isVisible) element.classList.remove("hidden");
  else element.classList.add("hidden");
};

const showModal = (modal) => (modal.style.display = "flex");
const closeModal = (modal) => (modal.style.display = "none");

// Check for localStorage on Page Load
document.addEventListener("DOMContentLoaded", () => {
  const storedUser = localStorage.getItem("loggedInUser");

  if (storedUser) {
    // Parse the stored user data from localStorage
    currentUser = JSON.parse(storedUser);
    updateUIAfterLogin();
  } else {
    toggleVisibility(loginSection, true);
    toggleVisibility(accountOverview, false);
  }
});

// Update UI after login
function updateUIAfterLogin() {
  toggleVisibility(loginSection, false);
  toggleVisibility(accountOverview, true);
  userNameDisplay.textContent = currentUser.username;
  balanceDisplay.textContent = currentUser.balance.toFixed(2);
  renderTransactions(currentUser.transactions);
  calculateSummaryStats(currentUser.transactions);
}

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
    updateUIAfterLogin();
    // Store user data in localStorage to persist across reloads
    localStorage.setItem("loggedInUser", JSON.stringify(currentUser));
  } else {
    alert("Invalid username or PIN");
  }
});

// Handle LogOut Btn
logoutBtn.addEventListener("click", () => {
  // Clear localStorage
  localStorage.removeItem("loggedInUser");

  // Reset the UI by toggling the hidden class
  toggleVisibility(loginSection, true);
  toggleVisibility(accountOverview, false);

  // Clear input fields
  usernameInput.value = "";
  pinInput.value = "";
});

// Handle money transfer submission
transferForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const recipientUsername = recipientUsernameInput.value;
  const amount = Number(amountInput.value);

  if (!amount || amount <= 0) {
    alert(`Invalid amount: ${amountInput.value}`);
    return;
  }

  // Find recipient
  const recipient = users.find((user) => user.username === recipientUsername);

  if (!recipient) {
    alert(`The user (${recipientUsername}) does not exist`);
    return;
  }

  if (currentUser.balance < amount) {
    alert("You have an insufficient balance.");
    return;
  }

  const transactionDate = new Date().toLocaleDateString();

  // Deduct from sender's balance
  currentUser.balance -= amount;
  currentUser.transactions.push({ amount: -amount, date: transactionDate });
  updateUIAfterLogin();

  // Add to recipient's balance and add transaction
  recipient.balance += amount;
  recipient.transactions.push({ amount, date: transactionDate });

  alert(
    `Transfer successful: R${amount.toFixed(2)} sent to ${recipient.username}`
  );

  // Clear form inputs
  recipientUsernameInput.value = "";
  amountInput.value = "";
  closeModal(transferModal);
});

// Handle request loan submission
requestLoanForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const loanAmount = Number(loanAmountInput.value);

  if (!loanAmount || loanAmount <= 0) {
    alert(`Invalid loan amount: ${loanAmountInput.value}`);
    return;
  }

  currentUser.balance += loanAmount;
  currentUser.transactions.push({
    amount: loanAmount,
    date: new Date().toLocaleDateString(),
  });

  updateUIAfterLogin();
  alert(
    `Loan Request successful: R${loanAmount.toFixed(2)} sent to ${
      currentUser.username
    }`
  );

  loanAmountInput.value = "";
  closeModal(requestLoanModal);
});

// Show modal when "Transfer Money" Btn is clicked
transferBtn.addEventListener("click", () => showModal(transferModal));

requestBtn.addEventListener("click", () => showModal(requestLoanModal));

// Close modal when close button is clicked
closeModalBtn.addEventListener("click", () => closeModal(transferModal));

loanCloseBtn.addEventListener("click", () => closeModal(requestLoanModal));

// Close modal when user clicks outside modal content
window.addEventListener("click", (e) => {
  if (e.target === transferModal) closeModal(transferModal);
  else if (e.target === requestLoanModal) closeModal(requestLoanModal);
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
      transaction.amount.toFixed(2) > 0 ? "+" : ""
    }${transaction.amount.toFixed(2)} 
    <span class="transaction-date">(${transaction.date})</span>`;

    transactionList.appendChild(li);
  });
}

function calculateSummaryStats(transactions) {
  const totalDeposits = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalWithdrawals = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  totalDepositsDisplay.textContent = `R ${totalDeposits.toFixed(2)}`;
  totalWithdrawalsDisplay.textContent = `R ${Math.abs(totalWithdrawals).toFixed(
    2
  )}`;
}
