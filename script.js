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

  // Dummy data for user accounts

  let balance = 12345.67; // Initial balance in ZAR
  let lastTransaction = { type: "Deposit", amount: 1000.0, currency: "ZAR" };

  const users = [
    {
      username: "john_doe",
      pin: 1234,
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
    updateBalanceDisplay(user.transactions, "ZAR");
    renderTransactions(user.transactions, "ZAR");
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
        updateBalanceDisplay(currentUser.transactions, "ZAR");
        renderTransactions(currentUser.transactions, "ZAR");
      } else {
        displayError(usernameError, "Invalid username or pin.");
      }
    }
  });

  // Currency switch handling
  currencySelect.addEventListener("change", (e) => {
    const selectedCurrency = e.target.value;
    const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (currentUser) {
      updateBalanceDisplay(currentUser.transactions, selectedCurrency);
      renderTransactions(currentUser.transactions, selectedCurrency);
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
  function updateBalanceDisplay(transactions, currency) {
    const balance = transactions.reduce(
      (acc, transaction) =>
        acc +
        (transaction.type === "Deposit"
          ? transaction.amount
          : -transaction.amount),
      0
    );
    balanceAmount.textContent = formatCurrency(
      balance * currencyRates[currency],
      currency
    );
    balanceTooltip.textContent = `Your current balance is ${formatCurrency(
      balance * currencyRates[currency],
      currency
    )}`;
  }

  // Render transactions list
  function renderTransactions(transactions, currency) {
    transactionList.innerHTML = "";
    transactions.forEach((transaction) => {
      const convertedAmount = transaction.amount * currencyRates[currency];
      const transactionItem = document.createElement("li");
      transactionItem.classList.add("transaction-item");
      const amountClass =
        transaction.type === "Deposit"
          ? "transaction-deposit"
          : "transaction-withdrawal";
      transactionItem.innerHTML = `<p>${transaction.date} - ${
        transaction.type
      }</p><p class="transaction-amount ${amountClass}">${formatCurrency(
        convertedAmount,
        currency
      )}</p>`;
      transactionList.appendChild(transactionItem);
    });
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
