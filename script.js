document.addEventListener("DOMContentLoaded", () => {
  let currentAccount;
  // Data
  const defaultAccounts = [
    {
      owner: "Thapelo Skhona Magqazana",
      movements: [
        { amount: 200, date: "2024-10-01" },
        { amount: 450, date: "2024-10-02" },
        { amount: -400, date: "2024-10-03" },
        { amount: 3000, date: "2024-10-04" },
        { amount: -650, date: "2024-10-05" },
        { amount: -130, date: "2024-10-06" },
        { amount: 70, date: "2024-10-07" },
        { amount: 1300, date: "2024-10-08" },
      ],
      balance: 100000,
      interestRate: 1.2, // %
      pin: 1111,
    },
    {
      owner: "Jessica Davis",
      movements: [
        { amount: 5000, date: "2024-10-01" },
        { amount: 3400, date: "2024-10-02" },
        { amount: -150, date: "2024-10-03" },
        { amount: -790, date: "2024-10-04" },
        { amount: -3210, date: "2024-10-05" },
        { amount: -1000, date: "2024-10-06" },
        { amount: 8500, date: "2024-10-07" },
        { amount: -30, date: "2024-10-08" },
      ],
      balance: 100000,
      interestRate: 1.5,
      pin: 2222,
    },
    {
      owner: "Steven Thomas Williams",
      movements: [
        { amount: 200, date: "2024-10-01" },
        { amount: -200, date: "2024-10-02" },
        { amount: 340, date: "2024-10-03" },
        { amount: -300, date: "2024-10-04" },
        { amount: -20, date: "2024-10-05" },
        { amount: 50, date: "2024-10-06" },
        { amount: 400, date: "2024-10-07" },
        { amount: -460, date: "2024-10-08" },
      ],
      balance: 100000,
      interestRate: 0.7,
      pin: 3333,
    },
    {
      owner: "Sarah Smith",
      movements: [
        { amount: 430, date: "2024-10-01" },
        { amount: 1000, date: "2024-10-02" },
        { amount: 700, date: "2024-10-03" },
        { amount: 50, date: "2024-10-04" },
        { amount: 90, date: "2024-10-05" },
      ],
      balance: 100000,
      interestRate: 1,
      pin: 4444,
    },
  ];

  // Load accounts from localStorage or defaultAccounts
  const accounts =
    JSON.parse(localStorage.getItem("accounts")) || defaultAccounts;

  // Element references
  const loginForm = document.getElementById("login-form");
  const loginContainer = document.querySelector(".login-container");
  const usernameInput = document.getElementById("username");
  const pinInput = document.getElementById("pin");
  const togglePin = document.getElementById("toggle-pin");
  const rememberMeCheckbox = document.getElementById("remember-me");
  const sectionHomePage = document.getElementById("homepage");
  const balanceAmount = document.getElementById("balance-amount");
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const sidebarContent = document.querySelector(".sidebar-content");
  const notificationContainer = document.querySelector(".notification-icon");

  notificationContainer.style.display = "none";

  // Handle login success
  const loginSuccess = () => {
    loginContainer.style.display = "none";
    notificationContainer.style.display = "block";
    displayHomePage("block");
    greetUser(currentAccount.owner);
    updateBalanceDisplay();
    renderFilteredTransactions();
    calculateFinancialSummary(currentAccount, selectedCurrency);
    drawChart();
    updateSideBar();
    localStorage.setItem("currentAccount", JSON.stringify(currentAccount));
  };

  // Auto-fill username if 'Remember Me' was checked
  if (localStorage.getItem("rememberMe") === "true") {
    usernameInput.value = localStorage.getItem("username");
    rememberMeCheckbox.checked = true;
  }

  const createUsernames = (accounts) => {
    accounts.forEach((account) => {
      const namesList = account.owner.toLowerCase().trim().split(" ");
      const initialsList = namesList.map((name) => {
        return name[0];
      });
      const username = initialsList.join("");
      account.username = username;
    });
  };

  createUsernames(accounts);

  // Helper function to display error messages
  const showError = (element, message = "", visible = false) => {
    const errorMessage = element.querySelector(".error-message");
    errorMessage.textContent = message;
    errorMessage.style.visibility = visible ? "visible" : "hidden";
  };

  // Function to update balance in selected currency
  const updateBalanceDisplay = () => {
    balanceAmount.textContent = currencyCalculation(
      currentAccount.balance,
      selectedCurrency
    );
  };

  // Update accounts in localStorage
  const updateAccountsStorage = () => {
    localStorage.setItem("accounts", JSON.stringify(accounts));
  };

  // Greeting message based on time of day
  const greetUser = (name) => {
    const greetingMessage = document.getElementById("greeting-message");
    const hour = new Date().getHours();
    const greeting =
      hour < 12
        ? `Good Morning, ${name}`
        : hour < 18
        ? `Good Afternoon, ${name}`
        : `Good Evening, ${name}`;
    greetingMessage.textContent = greeting;
  };

  // Function to filter transactions
  const filterTransactions = (transactions, filters) => {
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;
      const amount = Math.abs(transaction.amount);
      const isDeposit = transaction.amount > 0;

      // Filter by transaction type (deposit or withdrawal)
      if (filters.transactionType !== "all") {
        if (filters.transactionType === "deposit" && !isDeposit) return false;
        if (filters.transactionType === "withdrawal" && isDeposit) return false;
      }

      // Filter by date range
      if (startDate && transactionDate < startDate) return false;
      if (endDate && transactionDate > endDate) return false;

      // Filter by amount range
      if (filters.minAmount && amount < filters.minAmount) return false;
      if (filters.maxAmount && amount > filters.maxAmount) return false;

      // Filter by search query
      if (
        filters.searchQuery &&
        !transaction.date.includes(filters.searchQuery) &&
        !String(amount).includes(filters.searchQuery)
      ) {
        return false;
      }

      return true;
    });
  };

  // Function to render filtered transactions
  const renderFilteredTransactions = () => {
    const searchQuery = document
      .getElementById("search-bar")
      .value.toLowerCase();
    const transactionType = document.getElementById("transaction-type").value;
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;
    const minAmount = document.getElementById("min-amount").value;
    const maxAmount = document.getElementById("max-amount").value;

    // Define filter object
    const filters = {
      searchQuery,
      transactionType,
      startDate,
      endDate,
      minAmount: minAmount ? parseFloat(minAmount) : null,
      maxAmount: maxAmount ? parseFloat(maxAmount) : null,
    };

    // Filter the transactions
    const filteredTransactions = filterTransactions(
      currentAccount.movements,
      filters
    );

    // Render the filtered transactions
    renderTransactions(filteredTransactions, selectedCurrency);
  };

  const updateSideBar = () => {
    // Clear the container
    sidebarContent.innerHTML = "";

    sidebarContent.innerHTML = `
        <button id="dark-mode-toggle" class="theme-toggle action-btn">
          Dark Mode
        </button>
        <button id="logout-btn" class="logout-button action-btn">
          Logout
        </button> 
    `;

    const darkModeToggle = document.getElementById("dark-mode-toggle");
    darkModeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");

      if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
        darkModeToggle.textContent = "Light Mode";
      } else {
        localStorage.setItem("darkMode", "disabled");
        darkModeToggle.textContent = "Dark Mode";
      }
    });

    if (localStorage.getItem("darkMode") === "enabled") {
      document.body.classList.add("dark-mode");
    }

    document.getElementById("logout-btn").addEventListener("click", () => {
      localStorage.removeItem("currentAccount");
      location.reload(); // Reload to return to login page
    });
  };

  const displayHomePage = (state) => {
    sectionHomePage.style.display = state;
  };

  // Toggle sidebar open/close
  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

  // Function to open modals
  const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    modal.style.display = "block";
  };

  // Function to close modals
  const closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    modal.style.display = "none";
  };

  // Event listeners for opening modals
  document
    .getElementById("transfer-btn")
    .addEventListener("click", () => openModal("transfer-modal"));
  document
    .getElementById("loan-btn")
    .addEventListener("click", () => openModal("loan-modal"));
  document
    .getElementById("close-account-btn")
    .addEventListener("click", () => openModal("close-account-modal"));

  // Event Listeners for filters and search bar
  document
    .getElementById("search-bar")
    .addEventListener("input", renderFilteredTransactions);
  document
    .getElementById("transaction-type")
    .addEventListener("change", renderFilteredTransactions);
  document
    .getElementById("start-date")
    .addEventListener("change", renderFilteredTransactions);
  document
    .getElementById("end-date")
    .addEventListener("change", renderFilteredTransactions);
  document
    .getElementById("min-amount")
    .addEventListener("input", renderFilteredTransactions);
  document
    .getElementById("max-amount")
    .addEventListener("input", renderFilteredTransactions);

  // Event listeners for closing modals
  document.querySelectorAll(".close-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const modal = e.target.closest(".modal");
      modal.style.display = "none";
    });
  });

  // Close modals when clicking outside
  window.addEventListener("click", (event) => {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  });

  // Toggle Pin Visibility
  togglePin.addEventListener("click", () => {
    if (pinInput.type === "password") {
      pinInput.type = "text";
      togglePin.textContent = "Hide";
    } else {
      pinInput.type = "password";
      togglePin.textContent = "Show";
    }
  });

  const currencyCalculation = (amount, selectedCurrency) => {
    let currencySymbol;
    if (selectedCurrency === "USD") {
      amount = amount / 18.5;
      currencySymbol = "$";
    } else if (selectedCurrency === "EUR") {
      amount = amount / 20;
      currencySymbol = `€`;
    } else {
      currencySymbol = `R`;
    }

    return `${currencySymbol} ${amount.toFixed(2)}`;
  };

  // Render transactions
  const renderTransactions = (transactions, selectedCurrency) => {
    const transactionsList = document.getElementById("transaction-list");

    transactionsList.innerHTML = "";

    transactions.forEach((transaction) => {
      let type;
      let icon;
      if (transaction.amount > 0) {
        type = "Deposit";
        icon = "fa-arrow-down text-success";
      } else {
        type = "Withdrawal";
        icon = "fa-arrow-up text-danger";
      }
      const transactionDetails = `
        <tr>
            <td>${transaction.date}</td>
            <td>
              <i class="fas ${icon}"></i>
              ${type}
            </td>
            <td>${currencyCalculation(
              Math.abs(transaction.amount),
              selectedCurrency
            )}</td>
        </tr>
      `;

      transactionsList.innerHTML += transactionDetails;
    });
  };

  // Helper function to get today's date
  const getCurrentDate = () => new Date().toISOString().slice(0, 10);

  const totalDepositsElement = document.getElementById("total-deposits");
  const totalWithdrawalsElement = document.getElementById("total-withdrawals");
  const totalInterestElement = document.getElementById("total-interest");

  // Function to calculate financial summary
  const calculateFinancialSummary = (account, selectedCurrency) => {
    const totalDeposits = account.movements
      .filter((movement) => {
        return movement.amount > 0;
      })
      .reduce((acc, movement) => {
        return acc + movement.amount;
      }, 0);

    const totalWithdrawals = account.movements
      .filter((movement) => {
        return movement.amount < 0;
      })
      .map((movement) => {
        return Math.abs(movement.amount);
      })
      .reduce((acc, curr) => {
        return acc + curr;
      }, 0);

    // Calculate interest earned based on deposits
    const totalInterest = account.movements
      .filter((movement) => {
        return movement.amount > 0;
      })
      .map((movement) => {
        return movement.amount * (account.interestRate / 100);
      })
      .reduce((acc, curr) => {
        return acc + curr;
      }, 0);

    // Display results
    totalDepositsElement.textContent = currencyCalculation(
      totalDeposits,
      selectedCurrency
    );
    totalWithdrawalsElement.textContent = currencyCalculation(
      totalWithdrawals,
      selectedCurrency
    );
    totalInterestElement.textContent = currencyCalculation(
      totalInterest,
      selectedCurrency
    );
  };

  let financialChartInstance;

  const drawChart = () => {
    // If a chart already exists, destroy it before creating a new one
    if (financialChartInstance) {
      financialChartInstance.destroy();
    }

    const totalDeposits = parseFloat(
      totalDepositsElement.textContent.replace(/[^\d.-]/g, "")
    );
    const totalWithdrawals = parseFloat(
      totalWithdrawalsElement.textContent.replace(/[^\d.-]/g, "")
    );
    const totalInterest = parseFloat(
      totalInterestElement.textContent.replace(/[^\d.-]/g, "")
    );

    const ctx = document.getElementById("financial-pie-chart").getContext("2d");

    // Create the new chart instance and assign it to the global variable
    financialChartInstance = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Deposits", "Withdrawals", "Interest Earned"],
        datasets: [
          {
            data: [totalDeposits, totalWithdrawals, totalInterest],
            backgroundColor: ["#4caf50", "#f44336", "#ffeb3b"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    });
  };

  // Simulate receiving a new notification
  const triggerNotification = () => {
    const notificationIcon = document.querySelector(".notification-icon i");
    const notificationCount = document.querySelector(".notification-count");

    // Increase the notification count (for simulation purposes)
    let count = parseInt(notificationCount.textContent) || 0;
    count++;
    notificationCount.textContent = count;

    // Add pulse animation class
    notificationIcon.classList.add("pulse-animation");

    // Optionally remove the pulse animation after a certain time
    setTimeout(() => {
      notificationIcon.classList.remove("pulse-animation");
    }, 5000); // Pulse for 5 seconds
  };

  let selectedCurrency = "ZAR";
  // Currency Switcher
  const currencySelect = document.getElementById("currency-select");

  currencySelect.addEventListener("change", function () {
    selectedCurrency = this.value;
    updateBalanceDisplay();

    // Re-render the transaction list
    renderFilteredTransactions();
    calculateFinancialSummary(currentAccount, selectedCurrency);
    drawChart();
  });

  displayHomePage("none");

  const fab = document.getElementById("fab");
  const fabContainer = document.querySelector(".fab-container");

  // Toggle FAB actions on click
  fab.addEventListener("click", () => {
    fabContainer.classList.toggle("fab-active");
  });

  // Form Validation
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent form submission

    // Clear previous errors
    showError(loginForm);

    const username = usernameInput.value.trim().toLowerCase();
    const pin = pinInput.value.trim();

    // Validate Username
    if (username === "") {
      showError(loginForm, "Please enter a valid username.", true);
      return;
    }

    // Validate Pin
    if (pin.length < 4) {
      showError(loginForm, "Please enter a valid pin.", true);
      return;
    }

    // Store 'Remember Me' state in localStorage if checked
    if (rememberMeCheckbox.checked) {
      localStorage.setItem("rememberMe", "true");
      localStorage.setItem("username", username);
    } else {
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("username");
    }

    currentAccount = accounts.find(
      (account) => account.username === username && account.pin === Number(pin)
    );

    if (!currentAccount) {
      showError(loginForm, "Account does not exist.", true);
      return;
    }

    loginSuccess();
  });

  const transferForm = document.getElementById("transfer-form");

  transferForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Clear previous errors
    showError(transferForm);
    const recipientInput = document
      .getElementById("recipient")
      .value.trim()
      .toLowerCase();
    const amount = Number(
      document.getElementById("transfer-amount").value.trim()
    );

    const recipient = accounts.find(
      (account) => account.username === recipientInput
    );

    if (!recipient) {
      showError(transferForm, "The recipient's username does not exist", true);
      return;
    } else if (amount <= 0 || amount > recipient.balance) {
      showError(transferForm, "Invalid amount", true);
      return;
    } else {
      recipient.balance += amount;
      currentAccount.balance -= amount;
      currentAccount.movements.push({
        amount: -amount,
        date: getCurrentDate(),
      });
      closeModal("transfer-modal");

      updateBalanceDisplay();

      renderFilteredTransactions();
      triggerNotification();

      calculateFinancialSummary(currentAccount, selectedCurrency);
      drawChart();
    }
  });

  const loanForm = document.getElementById("loan-modal");

  loanForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Clear previous errors
    showError(transferForm);
    const loanAmount = Number(
      document.getElementById("loan-amount").value.trim()
    );

    if (!loanAmount) {
      showError(loanForm, "Invalid amount", true);
      return;
    } else {
      currentAccount.balance += loanAmount;
      currentAccount.movements.push({
        amount: loanAmount,
        date: getCurrentDate(),
      });

      closeModal("loan-modal");

      updateBalanceDisplay();
      triggerNotification();

      renderFilteredTransactions();

      calculateFinancialSummary(currentAccount, selectedCurrency);
      drawChart();
    }
  });

  const closeAccountForm = document.getElementById("close-account-form");
  // Handle account closure
  closeAccountForm.addEventListener("submit", (event) => {
    event.preventDefault();

    showError(closeAccountForm);
    const username = document
      .getElementById("closure-username")
      .value.trim()
      .toLowerCase();
    const pin = document.getElementById("closure-pin").value.trim();

    if (
      username !== currentAccount.username ||
      pin !== currentAccount.pin.toString()
    ) {
      showError(closeAccountForm, "Incorrect credentials", true);
      return;
    }

    // Remove account
    const accountIndex = accounts.findIndex((acc) => acc.username === username);
    if (accountIndex !== -1) {
      accounts.splice(accountIndex, 1); // Remove account from array
      updateAccountsStorage(); // Update localStorage

      // Logout and reset
      localStorage.removeItem("currentAccount");
      localStorage.clear();
      location.reload(); // Reload to login page
    }
  });

  // Persist login state (if logged in previously)
  const persistLogin = localStorage.getItem("currentAccount");
  if (persistLogin) {
    currentAccount = JSON.parse(persistLogin);
    loginSuccess();
  }
});
