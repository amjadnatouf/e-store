// <--------- register Page --------->
const btnRegister = document.getElementById("registerForm");

// Function to generate a unique ID for a user
function generateUserId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

btnRegister.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Validation
  if (
    name === "" ||
    email === "" ||
    password === "" ||
    confirmPassword === ""
  ) {
    alert("Please fill in all fields");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  // Proceed with registration if validations pass
  const userData = {
    id: generateUserId(),
    name: name,
    email: email,
    password: password,
  };

  // Store user data in local storage
  if (localStorage.getItem("usersData")) {
    // If data already exists in local storage, retrieve, update, and store it again
    let existingData = JSON.parse(localStorage.getItem("usersData"));
    existingData.push(userData);
    localStorage.setItem("usersData", JSON.stringify(existingData));
  } else {
    // If no data exists, create a new array and store the user data
    localStorage.setItem("usersData", JSON.stringify([userData]));
  }
  console.log("first", window.location);

  alert("User registered successfully!");
  console.log(window.location);
  window.location.href = "../login.html";
});
