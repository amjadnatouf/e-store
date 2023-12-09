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
    displayCartItems();
    displayFavoriteItems();
    showCartModalForUser(); // Update the cart modal after the page reloads
    showFavModalForUser(); // Update the favorites modal after the page reloads
    addQuantityEventListenersCheckout();
  } else {
    toggleUserLockIcons();
    cartIcon.style.display = "none";
    favIcon.style.display = "none";
  }
};

const userMenu = document.querySelector("#userDropdownBtn");
const userDropdown = document.querySelector("#userDropdown");
const overlay = document.querySelector("#overlay");

userMenu.addEventListener("click", function (e) {
  if (
    userDropdown.style.display === "none" ||
    userDropdown.style.display === ""
  ) {
    userDropdown.style.display = "block";
    overlay.style.display = "block";
  } else {
    userDropdown.style.display = "none";
    overlay.style.display = "none";
  }

  e.stopPropagation(); // Prevent the click event from propagating to the document
});

document.addEventListener("click", function (event) {
  if (!event.target.matches("#userDropdownBtn")) {
    userDropdown.style.display = "none";
    overlay.style.display = "none";
  }
});

// <----------------------------------->
const cartShopping = document.getElementById("cart-shopping");
const favShopping = document.getElementById("fav-shopping");
cartShopping.addEventListener("click", () => {
  window.location.href = "products.html";
});

favShopping.addEventListener("click", () => {
  window.location.href = "products.html";
});
