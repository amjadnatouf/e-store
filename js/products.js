let userCart = [];
let userFav = [];

const globalUserData = {
  isAuthenticated: false,
  name: "",
  id: "",
  email: "",
};

// Check and update global user data
const userData = JSON.parse(localStorage.getItem("usersData"));
const authenticatedUser = userData?.find(
  (user) => user.isAuthenticated === true
);

if (authenticatedUser) {
  const { isAuthenticated, name, id, email } = authenticatedUser;

  // Update global user data
  Object.assign(globalUserData, { isAuthenticated, name, id, email });

  // Retrieve user-specific cart and favorites from local storage
  userCart = JSON.parse(localStorage.getItem(`${id}_cart`)) || [];
  userFav = JSON.parse(localStorage.getItem(`${id}_favorites`)) || [];
  // Update badges
  updateCartBadgeForUser();
  updateFavBadgeForUser();
}

// Functions to manage user-specific cart and favorites
function addToCartForUser(product) {
  const existingProductIndex = userCart.findIndex(
    (item) => item.id === product.id
  );

  if (existingProductIndex > -1) {
    userCart[existingProductIndex].quantity += 1;
  } else {
    userCart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem(`${globalUserData.id}_cart`, JSON.stringify(userCart));
  updateCartBadgeForUser();
}

function removeFromCartForUser(productId) {
  userCart = userCart.filter((item) => item.id !== productId);
  localStorage.setItem(`${globalUserData.id}_cart`, JSON.stringify(userCart));
  updateCartBadgeForUser();
}

function addToFavForUser(product) {
  const existingIndex = userFav.findIndex((item) => item.id === product.id);

  if (existingIndex > -1) {
    userFav.splice(existingIndex, 1);
  } else {
    userFav.push(product);
  }

  localStorage.setItem(
    `${globalUserData.id}_favorites`,
    JSON.stringify(userFav)
  );
  updateFavBadgeForUser();
}

function removeFromFavForUser(productId) {
  userFav = userFav.filter((item) => item.id !== productId);
  localStorage.setItem(
    `${globalUserData.id}_favorites`,
    JSON.stringify(userFav)
  );
  updateFavBadgeForUser();
}

function updateCartBadgeForUser() {
  const cartBadge = document.querySelector("#cartBadge");

  // Calculate total quantity of products in the cart
  const totalQuantity = userCart.reduce(
    (total, product) => total + product.quantity,
    0
  );

  // Update the cart badge count
  cartBadge.style.display = totalQuantity < 1 ? "none" : "inline-block";
  cartBadge.textContent = totalQuantity.toString();
}

function updateFavBadgeForUser() {
  const favBadge = document.querySelector("#favBadge");
  favBadge.style.display = userFav.length < 1 ? "none" : "inline-block";
  favBadge.textContent = userFav.length.toString();
}

// Adding event listeners to "Add to a User Cart " buttons
// Adding event listeners to "Add to a User Favorit" buttons

// Adding event listeners to "Add to Cart" buttons
const addToCartButtons = document.querySelectorAll("#add-cart");

addToCartButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    if (!globalUserData.isAuthenticated) {
      alert("Please log in first.");
      return;
    }

    console.log(event.target);
    const productCard = event.target.closest(".product-card");
    const currentItem = products.find((e) => e.id === parseInt(productCard.id));
    addToCartForUser(currentItem); // Pass the product object to addToCartForUser
    showCartModalForUser(); // Update the cart modal after adding the product
  });
});

// Adding event listeners to "Add to Favorites" buttons
const addToFavButtons = document.querySelectorAll("#add-fav");
addToFavButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    if (!globalUserData.isAuthenticated) {
      alert("Please log in first.");
      return;
    }
    const productCard = event.target.closest(".product-card");
    button.classList.toggle("far");
    button.classList.toggle("fas");
    const currentItem = products.find((e) => e.id === parseInt(productCard.id));
    addToFavForUser(currentItem); // Pass the product object to addToFavForUser
    showFavModalForUser(); // Update the favorites modal after adding the product
  });
});

// Function quantity update logic from the modal display - Increase quantity
function increaseQuantity(productId) {
  const index = userCart.findIndex((item) => item.id === productId);
  if (index > -1) {
    userCart[index].quantity += 1;
    updateCartLocalStorage(); // Update localStorage after quantity change
    showCartModalForUser(); // Update the cart modal after quantity change
    updateCheckoutQuantityDisplay(productId);
    updateTotalPrice();
  }
}

// Function quantity update logic from the modal display - Decrease quantity
function decreaseQuantity(productId) {
  const index = userCart.findIndex((item) => item.id === productId);
  if (index > -1) {
    if (userCart[index].quantity > 1) {
      userCart[index].quantity -= 1;
      updateCheckoutQuantityDisplay(productId);
    } else {
      removeFromCartForUser(productId); // Remove the item if quantity becomes 0
      displayCartItems();
    }
    updateCartLocalStorage(); // Update localStorage after quantity change
    showCartModalForUser(); // Update the cart modal after quantity change or removal
    updateTotalPrice();
  }
}

// Add event listeners to the increase and decrease buttons in the modal
function addQuantityEventListeners() {
  const increaseButtons = document.querySelectorAll(".quantity-btn.increase");
  increaseButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const productCard = event.target
        .closest(".cart-item")
        .querySelector(".remove-from-cart")
        .getAttribute("data-id");
      const productId = parseInt(productCard);
      increaseQuantity(productId);
    });
  });

  const decreaseButtons = document.querySelectorAll(".quantity-btn.decrease");
  decreaseButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const productCard = event.target
        .closest(".cart-item")
        .querySelector(".remove-from-cart")
        .getAttribute("data-id");
      const productId = parseInt(productCard);
      decreaseQuantity(productId);
    });
  });
}

// Function to display product in cart modal
function showCartModalForUser() {
  const cartModalBody = document.querySelector("#cartModalCenter .modal-body");
  cartModalBody.innerHTML = ""; // Clear previous content

  if (userCart.length === 0) {
    cartModalBody.textContent = "Your Cart Is Empty";
    return;
  }

  // const userCart = `${globalUserData.id}_cart`;

  userCart.forEach((product) => {
    const productItem = document.createElement("div");
    productItem.classList.add("cart-item");
    productItem.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div class="d-flex justify-content-between align-items-center">
          <img class="mr-3" src="${product.image}" width="60" height="60" alt="${product.title}"/>
          <div>
            <p class="m-0">${product.title}</p>
            <p class="m-0">Price: ${product.price}$</p>
          </div>
        </div>
        <div class="d-flex flex-column justify-content-between align-items-center">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <button class="btn btn-secondary quantity-btn decrease fs-6">-</button>
            <p class="quantity my-0 mx-1">${product.quantity}</p>
            <button class="btn btn-secondary quantity-btn increase fs-6">+</button>
          </div>
          <button class="btn btn-danger remove-from-cart fs-7" data-id="${product.id}">Remove</button>
        </div>
      </div>
    `;
    cartModalBody.appendChild(productItem);

    // Add event listener for removing from cart
    const removeButton = productItem.querySelector(".remove-from-cart");
    removeButton.addEventListener("click", () => {
      removeFromCartForUser(product.id); // Call the function to remove from the cart
      showCartModalForUser(); // Update the cart modal after removing
      updateCartBadgeForUser(); // Update the cart badge count
    });
  });
  addQuantityEventListeners();
  updateCartBadgeForUser(); // Update the cart badge count
}

// Function to display product in favorites modal
function showFavModalForUser() {
  const favModalBody = document.querySelector("#favModalCenter .modal-body");
  favModalBody.innerHTML = ""; // Clear previous content

  if (userFav.length === 0) {
    favModalBody.textContent = "Add Some Favorite Items!";
    return;
  }

  userFav.forEach((product) => {
    const productItem = document.createElement("div");
    productItem.classList.add("fav-item");
    productItem.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div class="d-flex justify-content-between align-items-center">
          <img class="mr-3" src="${product.image}" width="60" height="60" alt="${product.title}"/>
          <div>
            <p class="m-0">${product.title}</p>
            <p class="m-0">Price: ${product.price}$</p>
          </div>
        </div>
        <button class="btn btn-danger remove-from-fav fs-7" data-id="${product.id}">Remove</button>
      </div>
    `;
    favModalBody.appendChild(productItem);

    // Add event listener for removing from favorites
    const removeButton = productItem.querySelector(".remove-from-fav");
    removeButton.addEventListener("click", () => {
      removeFromFavForUser(product.id); // Call the function to remove from favorites
      showFavModalForUser(); // Update the favorites modal after removing
      updateFavBadgeForUser(); // Update the favorites badge count
    });
  });
}

// Function to update the local storage when the user's cart is updated
function updateCartLocalStorage() {
  localStorage.setItem(`${globalUserData.id}_cart`, JSON.stringify(userCart));
}

// Function to update the local storage when the user's favorites are updated
function updateFavLocalStorage() {
  localStorage.setItem(
    `${globalUserData.id}_favorites`,
    JSON.stringify(userFav)
  );
}

// When the page loads, retrieve cart and favorites data from local storage
window.onload = function () {
  const cartIcon = document.getElementById("cartIcon");
  const favIcon = document.getElementById("favIcon");
  if (authenticatedUser) {
    toggleUserLockIcons(); // Show user or lock icon based on authentication
    cartIcon.style.display = "inline-block"; // Show cart icon
    favIcon.style.display = "inline-block"; // Show favorite icon
    updateUserInfo();

    // Update each product's favorite icon state based on user's favorites
    const productCards = document.querySelectorAll(".product-card");
    productCards.forEach((productCard) => {
      const productId = parseInt(productCard.id);
      const addToFavButton = productCard.querySelector("#add-fav");

      // Check if the product is in favorites and update the icon
      if (isProductInFav(productId)) {
        addToFavButton.classList.remove("far");
        addToFavButton.classList.add("fas");
      }
    });
    showCartModalForUser(); // Update the cart modal after the page reloads
    showFavModalForUser(); // Update the favorites modal after the page reloads
    addQuantityEventListenersCheckout();
  } else {
    toggleUserLockIcons();
    cartIcon.style.display = "none";
    favIcon.style.display = "none";
  }
};

// Function to check if a product is in favorites
function isProductInFav(productId) {
  return userFav.some((item) => item.id === productId);
}

// Function to toggle user and lock icons based on authentication
const userIcon = document.getElementById("userIcon");
const lockIcon = document.getElementById("lockIcon");
function toggleUserLockIcons() {
  if (globalUserData.isAuthenticated) {
    userIcon.style.display = "inline-block";
    lockIcon.style.display = "none";
  } else {
    userIcon.style.display = "none";
    lockIcon.style.display = "inline-block";
  }
}

// Function to redirect to login page
function redirectToLogin() {
  // Replace 'login.html' with your actual login page URL
  window.location.href = "login.html";
}

lockIcon.addEventListener("click", redirectToLogin);

const usersData = JSON.parse(localStorage.getItem("usersData"));

// Function to handle logout
function logout() {
  // Reset authentication status
  globalUserData.isAuthenticated = false;

  // Find the user in usersData and update isAuthenticated to false
  const updatedUsersData = usersData.map((user) => {
    if (user.id === globalUserData.id) {
      return { ...user, isAuthenticated: false };
    }
    return user;
  });

  // Update the local storage with the modified usersData
  localStorage.setItem("usersData", JSON.stringify(updatedUsersData));

  redirectToLogin(); // Example function to redirect to login page
}

// Function to handle delete account
function deleteAccount() {
  if (globalUserData.isAuthenticated) {
    // Remove user's data from local storage
    localStorage.removeItem(`${globalUserData.id}_cart`);
    localStorage.removeItem(`${globalUserData.id}_favorites`);

    const updatedUsersData = usersData.filter(
      (e) => e.id !== globalUserData.id
    );

    localStorage.setItem("usersData", JSON.stringify(updatedUsersData));
    redirectToLogin();
    // Remove user's data from globalUserData (optional)
    // globalUserData = { isAuthenticated: false, name: "", id: "", email: "" };
    // Ensure to handle other UI updates or redirects if necessary
  }
}

// Event listeners
document.getElementById("logoutBtn").addEventListener("click", logout);
document
  .getElementById("deleteAccountBtn")
  .addEventListener("click", deleteAccount);

function updateUserInfo() {
  const userNameElement = document.getElementById("userName");
  const userEmailElement = document.getElementById("userEmail");

  // Check if user is authenticated
  if (globalUserData.isAuthenticated) {
    userNameElement.textContent = globalUserData.name;
    userEmailElement.textContent = globalUserData.email;

    // Show user icon, hide lock icon
    document.getElementById("userIcon").style.display = "inline-block";
    document.getElementById("lockIcon").style.display = "none";
  } else {
    // Hide user icon, show lock icon
    document.getElementById("userIcon").style.display = "none";
    document.getElementById("lockIcon").style.display = "inline-block";

    // Clear user info when logged out
    userNameElement.textContent = "";
    userEmailElement.textContent = "";
  }
}
let totalPrice = 0;

// <---------- checkout ---------->
// Display Cart Items
function displayCartItems() {
  const cartItemsContainer = document.getElementById("cartItems");
  cartItemsContainer.innerHTML = "";

  userCart.forEach((product) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("col-md-4", "product-card", "border-0", "cart-item");
    cartItem.innerHTML = `
        <div class="card">
          <img src="${product.image}" class="card-img-top" alt="${product.title}">
          <div class="card-body d-flex justify-content-between align-items-center px-3">
            <div class="text-left">
                <p class="my-3">${product.title}</p>
                <p class="mb-3">Price: ${product.price}$</p>
            </div>
            <div class="d-flex flex-column justify-content-between align-items-center">
                <div class="d-flex justify-content-between align-items-center mb-1">
                <button class="btn btn-secondary quantity-btn decrease-check fs-6">-</button>
                <p class="quantity my-0 mx-1" data-id="${product.id}">${product.quantity}</p>
                <button class="btn btn-secondary quantity-btn increase-check fs-6">+</button>
                </div>
                <button class="btn btn-danger remove-from-cart-check fs-7" data-id="${product.id}">Remove</button>
            </div>
        </div>
      `;
    cartItemsContainer.appendChild(cartItem);

    // Add event listener for removing from cart
    const removeButton = cartItem.querySelector(".remove-from-cart-check");
    removeButton.addEventListener("click", () => {
      removeFromCartForUser(product.id); // Call the function to remove from the cart
      showCartModalForUser(); // Update the cart modal after removing
      updateCartBadgeForUser(); // Update the cart badge count
      displayCartItems();
    });

    totalPrice += product.price * product.quantity;
  });

  document.getElementById("totalAmount").textContent = totalPrice.toFixed(2);
}

function displayFavoriteItems() {
  const favItemsContainer = document.getElementById("owl-example");
  favItemsContainer.innerHTML = ""; // Clear the container

  userFav.forEach((product) => {
    const favItem = document.createElement("div");
    favItem.classList.add("item"); // Add "item" class for Owl Carousel
    favItem.innerHTML = `
    <div class="mb-4 mr-4 cart-item">
      <div class="card">
        <img src="${product.image}" class="card-img-top" alt="${product.title}">
        <div class="card-body text-center">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text">Price: $${product.price}</p>
          <button class="btn btn-danger remove-from-fav-check">Remove</button>
        </div>
      </div>
    </div>
    `;

    // Append the newly created item to the container
    favItemsContainer.appendChild(favItem);

    // Add event listener for removing from favorites
    const removeButton = favItem.querySelector(".remove-from-fav-check");
    removeButton.addEventListener("click", () => {
      removeFromFavForUser(product.id); // Call the function to remove from favorites
      showFavModalForUser(); // Update the favorites modal after removing
      updateFavBadgeForUser(); // Update the favorites badge count
      // displayFavoriteItems(); // Re-render the favorite items
      window.location.reload();
    });
  });
  $("#owl-example").owlCarousel({
    loop: true,
    margin: 10,
    nav: true,
    autoPlay: true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 3,
      },
      1000: {
        items: 5,
      },
    },
  });
}

// Function to update the quantity display in the checkout
function updateCheckoutQuantityDisplay(productId) {
  const quantityElement = document.querySelector(
    `.quantity[data-id="${productId}"]`
  );
  if (quantityElement) {
    const updatedQuantity = userCart.find(
      (item) => item.id === productId
    ).quantity;
    quantityElement.textContent = updatedQuantity;
  }
}

// Updated event listeners for the increase and decrease buttons in the checkout
function addQuantityEventListenersCheckout() {
  const increaseButtonsCheckout = document.querySelectorAll(
    ".quantity-btn.increase-check"
  );
  increaseButtonsCheckout.forEach((button) => {
    button.addEventListener("click", (event) => {
      const productCard = event.target
        .closest(".cart-item")
        .querySelector(".remove-from-cart-check")
        .getAttribute("data-id");
      const productId = parseInt(productCard);
      increaseQuantity(productId);
    });
  });

  const decreaseButtonsCheckout = document.querySelectorAll(
    ".quantity-btn.decrease-check"
  );
  decreaseButtonsCheckout.forEach((button) => {
    button.addEventListener("click", (event) => {
      const productCard = event.target
        .closest(".cart-item")
        .querySelector(".remove-from-cart-check")
        .getAttribute("data-id");
      const productId = parseInt(productCard);
      decreaseQuantity(productId);
    });
  });
}

function updateTotalPrice() {
  totalPrice = userCart.reduce((total, product) => {
    return total + product.price * product.quantity;
  }, 0);

  document.getElementById("totalAmount").textContent = totalPrice.toFixed(2);
}
