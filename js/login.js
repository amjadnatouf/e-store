// <--------- Login Page --------->

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Kindly complete the User Data to login!");
    return;
  }

  // Check if user data exists in local storage
  const userData = JSON.parse(localStorage.getItem("usersData"));

  if (!userData) {
    // If no user data found, show alert to register
    alert("User is not exist!, Please Sign Up.");
    return;
  }

  // Find if the user with the provided email and password exists
  const loggedInUser = userData.find(
    (user) => user.email === email && user.password === password
  );

  if (loggedInUser) {
    // Update user data to mark as authenticated
    loggedInUser.isAuthenticated = true;
    // Update user data in local storage
    localStorage.setItem("usersData", JSON.stringify(userData));

    // User logged in, check if the current page is products.html
    const currentPage = window.location.pathname;
    if (currentPage.includes("products.html")) {
      // If the current page is products.html, no action needed
      // You can add additional logic or functionality here if required
    } else {
      // Redirect to products page
      // localStorage.setItem("isAuthenticated", true);
      window.location.href = "products.html"; // Replace with your products page URL
    }
  } else {
    // Show alert to login
    alert("Please login with valid credentials.");
  }
});
