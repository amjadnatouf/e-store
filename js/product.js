// Generating products data
const products = [];

// Function to generate product objects
function generateProduct(
  id,
  title,
  description,
  price,
  image,
  category,
  quantity
) {
  return {
    id,
    title,
    description,
    price,
    image,
    category,
    quantity,
  };
}

// Generating products for different categories
const techProducts = [
  generateProduct(
    1,
    "Laptop",
    "Powerful laptop for professional use",
    999,
    "../images/labtop.jpg",
    "Tech",
    20
  ),
  generateProduct(
    2,
    "Smartphone",
    "High-end smartphone with great features",
    699,
    "../images/iphone.jpg",
    "Tech",
    15
  ),
  generateProduct(
    3,
    "Wireless Earbuds",
    "Premium wireless earbuds with noise cancellation",
    199,
    "../images/airpods.webp",
    "Tech",
    30
  ),
  generateProduct(
    4,
    "Tablet",
    "Versatile tablet for work and entertainment",
    499,
    "../images/ipad.webp",
    "Tech",
    25
  ),
];

const clothesProducts = [
  generateProduct(
    5,
    "T-Shirt",
    "Comfortable cotton t-shirt",
    19,
    "../images/t-shirt.webp",
    "Clothes",
    50
  ),
  generateProduct(
    6,
    "Jeans",
    "Classic denim jeans",
    39,
    "../images/jeans.webp",
    "Clothes",
    35
  ),
  generateProduct(
    7,
    "Dress",
    "Elegant dress for special occasions",
    59,
    "../images/dress.webp",
    "Clothes",
    25
  ),
  generateProduct(
    8,
    "Jacket",
    "Stylish jacket for all seasons",
    79,
    "../images/jacket.webp",
    "Clothes",
    20
  ),
];

const sportProducts = [
  generateProduct(
    9,
    "Running Shoes",
    "Lightweight and durable running shoes",
    89,
    "../images/shoes.webp",
    "Sport",
    40
  ),
  generateProduct(
    10,
    "Yoga Mat",
    "Non-slip yoga mat for practice",
    29,
    "../images/yoga.webp",
    "Sport",
    60
  ),
  generateProduct(
    11,
    "Basketball",
    "High-quality basketball for games",
    49,
    "../images/basket.jpg",
    "Sport",
    30
  ),
  generateProduct(
    12,
    "Dumbbell Set",
    "Adjustable dumbbell set for workouts",
    149,
    "../images/dum.webp",
    "Sport",
    20
  ),
];

const watchesProducts = [
  generateProduct(
    13,
    "Smartwatch",
    "Feature-rich smartwatch for daily use",
    199,
    "../images/item-6.webp",
    "Watches",
    30
  ),
  generateProduct(
    14,
    "Analog Watch",
    "Classic analog watch with leather strap",
    99,
    "../images/item-2.webp",
    "Watches",
    45
  ),
  generateProduct(
    15,
    "Fitness Tracker",
    "Fitness tracker with heart rate monitor",
    79,
    "../images/item-3.webp",
    "Watches",
    50
  ),
  generateProduct(
    16,
    "Digital Watch",
    "Digital watch with multiple functions",
    59,
    "../images/item-4.webp",
    "Watches",
    55
  ),
];

// Combining products from different categories into one array
products.push(
  ...techProducts,
  ...clothesProducts,
  ...sportProducts,
  ...watchesProducts
);

// Function to generate product cards dynamically
function generateProductCards(productList) {
  const container = document.getElementById("productContainer");
  container.innerHTML = "";

  productList.forEach((product) => {
    const colDiv = document.createElement("div");
    colDiv.classList.add("col-lg-4");
    colDiv.classList.add("col-md-6");

    const productCard = document.createElement("div");
    productCard.classList.add("card");
    productCard.classList.add("product-card");
    productCard.id = product.id;

    productCard.innerHTML = `
        <img src="${product.image}" class="card-img-top image-object" height="331" alt="${product.title}">
        <div class="card-body ">
            <div class="d-flex justify-content-between align-items-center">
                <h5 class="card-title">${product.title}</h5>
                <p class="card-category">${product.category}</p>
            </div>
            <div class="card-text info mb-2">${product.description}</div>
            <div class="d-flex justify-content-between align-items-center">
            <button class="btn btn-primary add-to-cart" id="add-cart">Add to Cart</button>
            <p class="mb-0">${product.price}$</p>
            </div>
            <i class="far fa-heart fa-lg favorite-icon add-to-fav" id="add-fav"></i>
        </div>
      `;

    colDiv.appendChild(productCard);
    container.appendChild(colDiv);
  });
}

// Function to filter products based on search criteria
function filterProducts() {
  const filterType = document.getElementById("filter").value;
  const searchInput = document.getElementById("search").value.toLowerCase();

  const filteredProducts = products.filter((product) => {
    if (filterType === "name") {
      return product.title.toLowerCase().includes(searchInput);
    } else if (filterType === "category") {
      return product.category.toLowerCase().includes(searchInput);
    } else {
      return (
        product.title.toLowerCase().includes(searchInput) ||
        product.category.toLowerCase().includes(searchInput)
      );
    }
  });

  generateProductCards(filteredProducts);
}

// Call the function to generate initial product cards
generateProductCards(products);

// Event listeners for search input and filter select
document.getElementById("search").addEventListener("input", filterProducts);
document.getElementById("filter").addEventListener("change", filterProducts);

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
const cartCheckout = document.getElementById("cart-checkout");
const favCheckout = document.getElementById("fav-checkout");
cartCheckout.addEventListener("click", () => {
  window.location.href = "checkout.html";
});

favCheckout.addEventListener("click", () => {
  window.location.href = "checkout.html";
});
