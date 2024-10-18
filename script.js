document.addEventListener("DOMContentLoaded", () => {
  // Data
  const accounts = [
    {
      owner: "Thapelo Skhona Magqazana",
      movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
      balance: 100000,
      interestRate: 1.2, // %
      pin: 1111,
    },
    {
      owner: "Jessica Davis",
      movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
      balance: 100000,
      interestRate: 1.5,
      pin: 2222,
    },
    {
      owner: "Steven Thomas Williams",
      movements: [200, -200, 340, -300, -20, 50, 400, -460],
      balance: 100000,
      interestRate: 0.7,
      pin: 3333,
    },
    {
      owner: "Sarah Smith",
      movements: [430, 1000, 700, 50, 90],
      balance: 100000,
      interestRate: 1,
      pin: 4444,
    },
  ];

  // Element references
  const loginForm = document.getElementById("login-form");
  const loginCard = document.querySelector(".login-card");
  const usernameInput = document.getElementById("username");
  const pinInput = document.getElementById("pin");
  const togglePin = document.getElementById("toggle-pin");
  const rememberMeCheckbox = document.getElementById("remember-me");
  const sectionHomePage = document.getElementById("homepage");
  const greetMessage = document.getElementById("greeting-message");
  const balanceAmount = document.getElementById("balance-amount");
  const hamburgerIcon = document.getElementById("hamburger-icon");
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

  // Toggle sidebar open/close
  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

  const updateNavBar = () => {
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

    // mobileMenu = document.getElementById("mobile-menu");
  };

  const displayHomePage = (state) => {
    sectionHomePage.style.display = state;
  };

  // Initial setup - hide hamburger and menu by default
  // hamburgerIcon.style.display = "none";

  // Function to show hamburger and enable mobile menu toggle
  const enableMobileMenu = () => {
    if (window.innerWidth <= 576) {
      hamburgerIcon.style.display = "block"; // Show hamburger only on small screens
      let isMenuOpen = false;

      hamburgerIcon.addEventListener("click", () => {
        isMenuOpen = !isMenuOpen;

        if (isMenuOpen) {
          mobileMenu.style.display = "flex"; // Show the mobile menu
        } else {
          mobileMenu.style.display = "none"; // Hide the mobile menu
        }

        hamburgerIcon.classList.toggle("rotate"); // Rotate icon when clicked
      });
    }
  };

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

  let currentAccount;
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
    loginCard.style.display = "none"; // Hide login form
    updateNavBar(); // Update navbar after login
    displayHomePage("block"); // Show homepage
    greetMessage.textContent = `Welcome, ${currentAccount.owner}`;
    balanceAmount.textContent = currentAccount.balance;
  });
});
