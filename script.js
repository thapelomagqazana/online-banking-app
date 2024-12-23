document.addEventListener("DOMContentLoaded", () => {
  let currentAccount;
  let selectedCurrency = "ZAR"; 
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
        { amount: 1000, date: "2022-10-08" }
      ],
      balance: 100000,
      interestRate: 1.2, // %
      pin: 1111,
      locale: "en-ZA",
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
      locale: "af-ZA",
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
      locale: "xh-ZA",
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
      locale: "zu-ZA",
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

  // Currency formatting function
  const formatCurrency = (amount, currency, locale) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(amount);
  };

  // Handle login success
  const loginSuccess = () => {
    loginContainer.style.display = "none";
    notificationContainer.style.display = "block";
    displayHomePage("block");
    greetUser(currentAccount.owner.split(" ")[0]);
    updateBalanceDisplay();
    renderFilteredTransactions();
    calculateFinancialSummary(currentAccount, selectedCurrency);
    drawChart();
    updateSideBar();
    // Start the initial countdown
    resetTimer();
    displayCurrentDate();
    localStorage.setItem("currentAccount", JSON.stringify(currentAccount));
  };

  // Function to log the user out
  const logOutUser = () => {
    alert("Session expired. You are being logged out.");
    // Clear the current account and redirect to login page
    localStorage.removeItem("currentAccount");
    location.reload(); // Reload the page to log out and return to login screen
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
      logOutUser();
    });
  };

  const displayHomePage = (state) => {
    sectionHomePage.style.display = state;
    document.getElementById("countdown-timer").style.display = state;
  };

  // Function to get the current date in 'As of ...' format
  const displayCurrentDate = () => {
    // Create current date and time
    const currentDate = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };


    document.getElementById(
      "balance-date"
    ).textContent = `As of ${new Intl.DateTimeFormat(currentAccount.locale, options).format(currentDate)}`;
  };

  let countdownTime = 5 * 60; // 5 minutes in seconds
  const timerElement = document.getElementById("timer");
  let countdownInterval;

  // Update the timer display (MM:SS)
  const updateTimerDisplay = (timeLeft) => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  };

  // Start the countdown
  const startCountdown = () => {
    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
      countdownTime--;
      updateTimerDisplay(countdownTime);

      if (countdownTime <= 0) {
        clearInterval(countdownInterval);
        logOutUser();
      }
    }, 1000);
  };

  // Reset the timer when there's user activity
  const resetTimer = () => {
    countdownTime = 5 * 60; // Reset to 5 minutes
    updateTimerDisplay(countdownTime);
    startCountdown();
  };

  // Listen for user activity (mouse movements, key presses, etc.)
  const events = ["mousemove", "keydown", "mousedown", "touchstart"];
  events.forEach((event) => {
    document.addEventListener(event, resetTimer);
  });

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
    if (selectedCurrency === "USD") {
      amount = amount / 18.5;
    } else if (selectedCurrency === "EUR") {
      amount = amount / 20;
    }

    return formatCurrency(amount, selectedCurrency, currentAccount.locale);
  };

  // Function to calculate days passed and return formatted string
  const daysPassed = (dateString) => {
    const transactionDate = new Date(dateString);
    const currentDate = new Date();

    // Ensure the date is valid and not in the future
    if (isNaN(transactionDate) || transactionDate > currentDate) {
      return "Invalid Date";
    }


    // Calculate the difference in time and convert it to days
    const timeDiff = currentDate - transactionDate;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    // Return based on the difference in days, weeks, months, or years
    if (daysDiff === 0) return "Today";
    else if (daysDiff === 1) return "Yesterday";
    else if (daysDiff < 7) return `${daysDiff} days ago`;
    else if (daysDiff < 30){
      const weeksDiff = Math.floor(daysDiff / 7);
      return `${weeksDiff} week${weeksDiff > 1 ? "s" : ""} ago`;
    }
    else {
      return dateString;
    }
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

      // Calculate and format days passed for transaction date
      const daysPassedText = daysPassed(transaction.date);

      const transactionDetails = `
        <tr>
            <td>${daysPassedText}</td>
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
      closeModal("loan-modal");
      setTimeout(() => {
        currentAccount.balance += loanAmount;
        currentAccount.movements.push({
          amount: loanAmount,
          date: getCurrentDate(),
        });

        updateBalanceDisplay();
        triggerNotification();

        renderFilteredTransactions();

        calculateFinancialSummary(currentAccount, selectedCurrency);
        drawChart();
      }, 3000);
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
      logOutUser();
      localStorage.clear();
    }
  });

  // Persist login state (if logged in previously)
  const persistLogin = localStorage.getItem("currentAccount");
  if (persistLogin) {
    currentAccount = JSON.parse(persistLogin);
    loginSuccess();
  }
});
