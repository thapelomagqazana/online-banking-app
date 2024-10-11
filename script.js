// Dark Mode Toggle Functionality
document.addEventListener("DOMContentLoaded", () => {
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const body = document.body;

  darkModeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    // Toggle the button text based on the current mode
    darkModeToggle.textContent = body.classList.contains("dark-mode")
      ? "Light Mode"
      : "Dark Mode";
  });

  // Breadcrumb logic for navigation
  const breadcrumb = document.getElementById("breadcrumb");
  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      // Remove 'active' class from all items
      navItems.forEach((link) => link.classList.remove("active"));

      // Add 'active' class to clicked item
      const target = event.target.closest(".nav-item");
      target.classList.add("active");

      // Update breadcrumb dynamically based on clicked link
      const sectionName = target.textContent.trim();
      breadcrumb.innerHTML = `<p>Home > ${sectionName}</p>`;
    });
  });

  /////////////////////////////////////////////////////////////
  /////
  // Login functionality
  const loginForm = document.getElementById("login-form");
  const usernameInput = document.getElementById("username");
  const pinInput = document.getElementById("pin");
  const usernameError = document.getElementById("username-error");
  const pinError = document.getElementById("pin-error");
  const togglePin = document.getElementById("toggle-pin");

  const loginSection = document.getElementById("login-section");
  const homepage = document.getElementById("homepage");
  const navbar = document.getElementById("navbar");

  // Dummy data for user accounts
  const users = [
    {
      username: "john_doe",
      pin: 1234,
    },
    {
      username: "jane_doe",
      pin: 5678,
    },
    {
      username: "david_smith",
      pin: 2468,
    },
    {
      username: "alice_jones",
      pin: 1357,
    },
  ];

  // Toggle password visibility
  togglePin.addEventListener("click", () => {
    const isPasswordHidden = pinInput.type === "password";
    pinInput.type = isPasswordHidden ? "text" : "password";
    togglePin.textContent = isPasswordHidden ? "Hide" : "Show";
  });

  // Form validation and submission
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let isValid = validateForm(
      usernameInput,
      pinInput,
      usernameError,
      pinError
    );

    if (isValid) {
      const userExists = users.find(
        (user) =>
          user.username === usernameInput.value.trim() &&
          user.pin === Number(pinInput.value)
      );

      if (userExists) {
        // Hide the login section and show homepage components
        loginSection.style.display = "none";
        homepage.hidden = false;
        navbar.hidden = false;
      } else {
        usernameError.textContent = "Invalid username or pin.";
        usernameError.style.display = "block";
        pinError.style.display = "none";
      }
    }
  });

  // Validation function
  function validateForm(usernameInput, pinInput, usernameError, pinError) {
    let isValid = true;

    // Validate username
    if (!usernameInput.value.trim()) {
      usernameError.textContent = "Username is required.";
      usernameError.style.display = "block";
      usernameInput.classList.add("invalid");
      isValid = false;
    } else {
      usernameError.style.display = "none";
      usernameInput.classList.remove("invalid");
      usernameInput.classList.add("valid");
    }

    // Validate pin
    if (!pinInput.value.trim()) {
      pinError.textContent = "Pin is required.";
      pinError.style.display = "block";
      pinInput.classList.add("invalid");
      isValid = false;
    } else {
      pinError.style.display = "none";
      pinInput.classList.remove("invalid");
      pinInput.classList.add("valid");
    }

    return isValid;
  }
});
