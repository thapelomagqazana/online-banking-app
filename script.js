document.addEventListener("DOMContentLoaded", () => {
  // Data
  const accounts = [
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

  const showError = (element, message, stateOfVisibility) => {
    const errorMessage = element.querySelector(".error-message");
    errorMessage.textContent = message;
    errorMessage.style.visibility = stateOfVisibility;
  };

  const greetMessageBasedOnTimeOfDay = (name) => {
    const greetingMessage = document.getElementById("greeting-message");
    const hours = new Date().getHours();

    if (hours < 12) {
      greetingMessage.textContent = `Good Morning, ${name}`;
    } else if (hours < 18) {
      greetingMessage.textContent = `Good Afternoon, ${name}`;
    } else {
      greetingMessage.textContent = `Good Evening, ${name}`;
    }
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
      } else {
        localStorage.setItem("darkMode", "disabled");
      }
    });

    if (localStorage.getItem("darkMode") === "enabled") {
      document.body.classList.add("dark-mode");
    }
  };

  const displayHomePage = (state) => {
    sectionHomePage.style.display = state;
  };

  // Toggle sidebar open/close
  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
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

  const currencyCalculation = (balance, selectedCurrency) => {
    let currencySymbol;
    if (selectedCurrency === "USD") {
      balance = balance / 18.5;
      currencySymbol = "$";
    } else if (selectedCurrency === "EUR") {
      balance = balance / 20;
      currencySymbol = `€`;
    } else {
      currencySymbol = `R`;
    }

    return `${currencySymbol} ${balance.toFixed(2)}`;
  };

  // Render transactions
  const renderTransactions = (transactions, selectedCurrency) => {
    const transactionsList = document.getElementById("transaction-list");

    transactionsList.innerHTML = "";

    transactions.forEach((transaction) => {
      const type = transaction.amount > 0 ? "Deposit" : "Withdrawal";
      const transactionDetails = `
        <tr>
            <td>${transaction.date}</td>
            <td>${type}</td>
            <td>${currencyCalculation(
              Math.abs(transaction.amount),
              selectedCurrency
            )}</td>
        </tr>
      `;

      transactionsList.innerHTML += transactionDetails;
    });
  };

  let currentAccount;
  let selectedCurrency = "ZAR";
  // Currency Switcher
  const currencySelect = document.getElementById("currency-select");

  currencySelect.addEventListener("change", function () {
    selectedCurrency = this.value;
    balanceAmount.textContent = currencyCalculation(
      currentAccount.balance,
      selectedCurrency
    );

    // Re-render the transaction list
    renderTransactions(currentAccount.movements, selectedCurrency);
  });

  displayHomePage("none");

  // Form Validation
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent form submission

    // Clear previous errors
    showError(loginForm, "", "hidden");

    const username = usernameInput.value.trim().toLowerCase();
    const pin = pinInput.value.trim();

    // Validate Username
    if (username === "") {
      showError(loginForm, "Please enter a valid username.", "visible");
      return;
    }

    // Validate Pin
    if (pin.length < 4) {
      showError(loginForm, "Please enter a valid pin.", "visible");
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
      showError(loginForm, "Account does not exist.", "visible");
      return;
    }

    // Login success
    loginContainer.style.display = "none"; // Hide login form
    updateSideBar(); // Update navbar after login
    displayHomePage("block"); // Show homepage
    greetMessageBasedOnTimeOfDay(currentAccount.owner);
    balanceAmount.textContent = currencyCalculation(
      currentAccount.balance,
      selectedCurrency
    );
    renderTransactions(currentAccount.movements, selectedCurrency);
  });
});
