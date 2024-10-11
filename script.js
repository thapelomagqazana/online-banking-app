// Dark Mode Toggle Functionality
const darkModeToggle = document.getElementById("dark-mode-toggle");
const body = document.body;

darkModeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");

  // Change button text based on mode
  if (body.classList.contains("dark-mode"))
    darkModeToggle.textContent = "Light Mode";
  else darkModeToggle.textContent = "Dark Mode";
});

// Breadcrumb logic (This would dynamically update based on the page content)
const breadcrumb = document.getElementById("breadcrumb");
document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".nav-item");

  if (navItems.length > 0) {
    navItems.forEach((item) => {
      item.addEventListener("click", (event) => {
        if (event && event.target) {
          // Your click logic here
          // Remove 'active' class from all items
          document.querySelectorAll(".nav-item").forEach((link) => {
            link.classList.remove("active");
          });
          // Add 'active' class to clicked item
          event.target.parentElement.classList.add("active");

          // Update breadcrumb based on the clicked link
          const sectionName = event.target.textContent;
          breadcrumb.innerHTML = `<p>Home > ${sectionName}</p>`;
        }
      });
    });
  }
});
