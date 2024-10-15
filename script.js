// Dark Mode Toggle Functionality
document.addEventListener("DOMContentLoaded", () => {
  /////////////////////////////////////////////////////////////
  /////
  // Element references
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const body = document.body;
  const greetingMessage = document.getElementById("greeting-message");
  const balanceAmount = document.getElementById("balance-amount");
  const balanceTooltip = document.getElementById("balance-tooltip");
  const currencySelect = document.getElementById("currency-select");
  const transactionList = document.getElementById("transaction-list");
  const searchBar = document.getElementById("search-bar");
  const transactionTypeFilter = document.getElementById("transaction-type");
  const startDate = document.getElementById("start-date");
  const endDate = document.getElementById("end-date");
  const minAmount = document.getElementById("min-amount");
  const maxAmount = document.getElementById("max-amount");
  const loginForm = document.getElementById("login-form");
  const usernameInput = document.getElementById("username");
  const pinInput = document.getElementById("pin");
  const usernameError = document.getElementById("username-error");
  const pinError = document.getElementById("pin-error");
  const togglePin = document.getElementById("toggle-pin");
  const loginSection = document.getElementById("login-section");
  const homepage = document.getElementById("homepage");
  const navbar = document.getElementById("navbar");
  const hamburgerIcon = document.getElementById("hamburger-icon");
  const navbarLinks = document.getElementById("navbar-links");
  const logoutBtn = document.getElementById("logout-btn");
  const breadcrumb = document.getElementById("breadcrumb");
  const navItems = document.querySelectorAll(".nav-item");

  const transferBtn = document.getElementById("transfer-btn");

  // Loan tooltip
  const loanBtn = document.getElementById("loan-btn");

  const closeAccountBtn = document.getElementById("close-account-btn");
  // Get modals
  const transferModal = document.getElementById("transfer-modal");
  const loanModal = document.getElementById("loan-modal");
  const closeAccountModal = document.getElementById("close-account-modal");

  const closeButtons = document.querySelectorAll(".close-btn");

  // Dummy data for user accounts

  let balance = 12345.67; // Initial balance in ZAR
  let lastTransaction = { type: "Deposit", amount: 1000.0, currency: "ZAR" };
  let selectedCurrency = "ZAR";

  const users = [
    {
      username: "john_doe",
      pin: 1234,
      balance: 10000,
      transactions: [
        {
          date: "2024-10-05",
          type: "Deposit",
          amount: 5000,
          currency: "ZAR",
        },
        {
          date: "2024-10-03",
          type: "Withdrawal",
          amount: 2000,
          currency: "ZAR",
        },
        {
          date: "2024-10-01",
          type: "Deposit",
          amount: 1000,
          currency: "ZAR",
        },
        {
          date: "2024-09-28",
          type: "Withdrawal",
          amount: 750,
          currency: "ZAR",
        },
      ],
    },
    {
      username: "jane_doe",
      pin: 5678,
      balance: 10000,
      transactions: [
        { date: "2024-10-05", type: "Deposit", amount: 5000, currency: "ZAR" },
        {
          date: "2024-10-03",
          type: "Withdrawal",
          amount: 2000,
          currency: "ZAR",
        },
        { date: "2024-10-01", type: "Deposit", amount: 1000, currency: "ZAR" },
        {
          date: "2024-09-28",
          type: "Withdrawal",
          amount: 750,
          currency: "ZAR",
        },
      ],
    },
    {
      username: "david_smith",
      pin: 2468,
      balance: 10000,
      transactions: [
        { date: "2024-10-05", type: "Deposit", amount: 5000, currency: "ZAR" },
        {
          date: "2024-10-03",
          type: "Withdrawal",
          amount: 2000,
          currency: "ZAR",
        },
        { date: "2024-10-01", type: "Deposit", amount: 1000, currency: "ZAR" },
        {
          date: "2024-09-28",
          type: "Withdrawal",
          amount: 750,
          currency: "ZAR",
        },
      ],
    },
    {
      username: "alice_jones",
      pin: 1357,
      balance: 10000,
      transactions: [
        { date: "2024-10-05", type: "Deposit", amount: 5000, currency: "ZAR" },
        {
          date: "2024-10-03",
          type: "Withdrawal",
          amount: 2000,
          currency: "ZAR",
        },
        { date: "2024-10-01", type: "Deposit", amount: 1000, currency: "ZAR" },
        {
          date: "2024-09-28",
          type: "Withdrawal",
          amount: 750,
          currency: "ZAR",
        },
      ],
    },
  ];

  // Currency conversion rates
  const currencyRates = {
    ZAR: 1,
    USD: 0.065,
    EUR: 0.055,
  };

  // Check if user is already logged in (session persistence)
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (loggedInUser) {
    const user = JSON.parse(loggedInUser);
    loginSection.style.display = "none";
    homepage.hidden = false;
    navbar.hidden = false;
    setGreeting(user.username);
    updateBalanceDisplay(user.transactions, selectedCurrency);
    renderTransactions(user.transactions, selectedCurrency);
  }

  // Dark Mode Toggle
  darkModeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    darkModeToggle.textContent = body.classList.contains("dark-mode")
      ? "Light Mode"
      : "Dark Mode";
  });

  // Hamburger Menu Toggle
  hamburgerIcon?.addEventListener("click", () => {
    navbarLinks.classList.toggle("active");
  });

  // Logout functionality (clear session)
  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    window.location.reload();
  });

  // Form submission and validation
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateForm(usernameInput, pinInput, usernameError, pinError)) {
      const currentUser = users.find(
        (user) =>
          user.username === usernameInput.value.trim() &&
          user.pin === Number(pinInput.value)
      );
      if (currentUser) {
        localStorage.setItem("loggedInUser", JSON.stringify(currentUser));
        loginSection.style.display = "none";
        homepage.hidden = false;
        navbar.hidden = false;
        setGreeting(currentUser.username);
        updateBalanceDisplay(currentUser.balance, selectedCurrency);
        renderTransactions(currentUser.transactions, selectedCurrency);
      } else {
        displayError(usernameError, "Invalid username or pin.");
      }
    }
  });

  // Currency switch handling
  currencySelect.addEventListener("change", (e) => {
    selectedCurrency = e.target.value;
    const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (currentUser) {
      const user = users.find((user) => user.username === currentUser.username);
      updateBalanceDisplay(user.balance, selectedCurrency);
      renderTransactions(user.transactions, selectedCurrency);
    }
  });

  // Update breadcrumb navigation
  navItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      navItems.forEach((link) => link.classList.remove("active"));
      const target = event.target.closest(".nav-item");
      target.classList.add("active");
      const sectionName = target.textContent.trim();
      breadcrumb.innerHTML = `<p>Home > ${sectionName}</p>`;
    });
  });

  // Toggle password visibility
  togglePin.addEventListener("click", () => {
    const isPasswordHidden = pinInput.type === "password";
    pinInput.type = isPasswordHidden ? "text" : "password";
    togglePin.textContent = isPasswordHidden ? "Hide" : "Show";
  });

  // Event listeners for filters
  searchBar.addEventListener("input", applyFilters);
  transactionTypeFilter.addEventListener("change", applyFilters);
  startDate.addEventListener("change", applyFilters);
  endDate.addEventListener("change", applyFilters);
  minAmount.addEventListener("input", applyFilters);
  maxAmount.addEventListener("input", applyFilters);

  // Open Modals
  transferBtn.addEventListener(
    "click",
    () => (transferModal.style.display = "flex")
  );
  loanBtn.addEventListener("click", () => (loanModal.style.display = "flex"));
  closeAccountBtn.addEventListener(
    "click",
    () => (closeAccountModal.style.display = "flex")
  );

  // Close Modals
  closeButtons.forEach((button) =>
    button.addEventListener("click", () => {
      transferModal.style.display = "none";
      loanModal.style.display = "none";
      closeAccountModal.style.display = "none";
    })
  );

  // Close modal if clicking outside of content
  window.addEventListener("click", (e) => {
    if (
      e.target === transferModal ||
      e.target === loanModal ||
      e.target === closeAccountModal
    ) {
      transferModal.style.display = "none";
      loanModal.style.display = "none";
      closeAccountModal.style.display = "none";
    }
  });

  // Form validation and error handling
  const transferForm = document.getElementById("transfer-form");
  const loanForm = document.getElementById("loan-form");
  const closeAccountForm = document.getElementById("close-account-form");

  transferForm.addEventListener("submit", (e) => {
    e.preventDefault();

    showError(transferForm, "");
    const recipientUsername = document.getElementById("recipient").value.trim();
    const amount = parseFloat(document.getElementById("transfer-amount").value);

    const recipient = users.find((user) => user.username === recipientUsername);

    const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

    const sender = users.find((user) => user.username === currentUser.username);

    if (!recipient) {
      showError(transferForm, "Recipient not found.");
      return;
    }

    if (!currentUser) {
      showError(transferForm, "Current user not found.");
      return;
    }

    if (!amount || amount <= 0 || amount > sender.balance) {
      showError(transferForm, "Please enter a valid amount.");
      return;
    }

    // Update the sender's balance
    sender.balance -= amount;

    // Update sender's account by subtracting the transferred amount
    sender.transactions.push({
      date: new Date().toISOString().slice(0, 10), // Current Date
      type: "Withdrawal",
      amount,
      currency: selectedCurrency,
    });

    // Update the recipient's balance
    recipient.balance += amount;

    // Update recipient's account by adding the transferred amount
    recipient.transactions.push({
      date: new Date().toISOString().slice(0, 10), // Current Date
      type: "Deposit",
      amount,
      currency: selectedCurrency,
    });

    console.log(
      `Transferred ${amount} ${selectedCurrency} to ${recipientUsername}`
    );

    // Close the modal after successful transaction
    transferModal.style.display = "none";

    // Optionally, display confirmation or update the UI
    updateBalanceDisplay(sender.balance, selectedCurrency);
    renderTransactions(sender.transactions, selectedCurrency);
  });

  function showError(form, message) {
    const errorMsg = form.querySelector(".error-message");
    errorMsg.textContent = message;
    errorMsg.style.display = "block";
  }

  // Greeting based on time of day
  function setGreeting(username) {
    const hour = new Date().getHours();
    const greeting =
      hour < 12
        ? "Good Morning"
        : hour < 17
        ? "Good Afternoon"
        : "Good Evening";
    greetingMessage.textContent = `${greeting}, ${username}`;
  }

  // Format currency
  function formatCurrency(amount, currency) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  }

  // Update balance display and tooltip
  function updateBalanceDisplay(balance, currency) {
    balanceAmount.textContent = formatCurrency(
      balance * currencyRates[currency],
      currency
    );
    balanceTooltip.textContent = `Your current balance is ${formatCurrency(
      balance * currencyRates[currency],
      currency
    )}`;
  }

  // Render Transactions
  function renderTransactions(filteredTransactions, currency) {
    transactionList.innerHTML = ""; // Clear the list

    filteredTransactions.forEach((transaction) => {
      const convertedAmount = transaction.amount * currencyRates[currency];
      const row = document.createElement("tr");

      const icon = transaction.type === "Deposit" ? "⬆️" : "⬇️"; // Icons for deposit/withdrawal

      row.innerHTML = `
      <td>${transaction.date}</td>
      <td><span class="transaction-icon">${icon}</span>${transaction.type}</td>
      <td class="transaction-amount ${
        transaction.type === "Deposit"
          ? "transaction-deposit"
          : "transaction-withdrawal"
      }">${formatCurrency(convertedAmount, currency)}</td>
    `;
      transactionList.appendChild(row);
    });
  }

  // Apply filters
  function applyFilters() {
    const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (currentUser) {
      let filteredTransactions = currentUser.transactions;

      // Search filter
      const searchTerm = searchBar.value.toLowerCase();
      if (searchTerm) {
        filteredTransactions = filteredTransactions.filter(
          (transaction) =>
            transaction.type.toLowerCase().includes(searchTerm) ||
            transaction.date.includes(searchTerm) ||
            transaction.amount.toString().includes(searchTerm)
        );
      }

      // Transaction type filter
      const selectedType = transactionTypeFilter.value;
      if (selectedType !== "all") {
        filteredTransactions = filteredTransactions.filter(
          (transaction) => transaction.type.toLowerCase() === selectedType
        );
      }

      // Date range filter
      const start = new Date(startDate.value);
      const end = new Date(endDate.value);

      if (startDate.value && endDate.value) {
        filteredTransactions = filteredTransactions.filter((transaction) => {
          const transactionDate = new Date(transaction.date);
          return transactionDate >= start && transactionDate <= end;
        });
      }

      // Amount range filter
      const min = parseFloat(minAmount.value) || 0;
      const max = parseFloat(maxAmount.value) || Infinity;
      filteredTransactions = filteredTransactions.filter(
        (transaction) => transaction.amount >= min && transaction.amount <= max
      );

      // Render the filtered transactions
      renderTransactions(filteredTransactions, selectedCurrency);
    }
  }

  // Form validation
  function validateForm(usernameInput, pinInput, usernameError, pinError) {
    let isValid = true;
    if (!usernameInput.value.trim()) {
      displayError(usernameError, "Username is required.");
      isValid = false;
    } else {
      hideError(usernameError);
    }

    if (!pinInput.value.trim()) {
      displayError(pinError, "Pin is required.");
      isValid = false;
    } else {
      hideError(pinError);
    }
    return isValid;
  }

  // Error handling functions
  function displayError(element, message) {
    element.textContent = message;
    element.style.display = "block";
  }

  function hideError(element) {
    element.textContent = "";
    element.style.display = "none";
  }
});
