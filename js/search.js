// Event listener for "Remove from Cart" functionality (assuming a button or action for this)
// Implement similar logic to remove items from the cart

const searchInput = document.querySelector("#search");
const productCards = document.querySelectorAll(".product-card");
const productContainer = document.getElementById("productContainer");

function filterCards(searchTerm, selectInput) {
  const foundItems = Array.from(productCards).filter((card) => {
    const productName = card.querySelector("h5").textContent.toLowerCase();
    const productCategory = card
      .querySelector(".card-text.info")
      .textContent.toLowerCase();
    const productDescription = card
      .querySelector(".card-text.info")
      .textContent.toLowerCase();

    if (selectInput === "name" && productName.includes(searchTerm)) {
      return true;
    } else if (
      selectInput === "category" &&
      productCategory.includes(searchTerm)
    ) {
      return true;
    } else if (
      selectInput === "description" &&
      productDescription.includes(searchTerm)
    ) {
      return true;
    } else if (
      selectInput === "general" &&
      (productName.includes(searchTerm) ||
        productCategory.includes(searchTerm) ||
        productDescription.includes(searchTerm))
    ) {
      return true;
    } else if (
      !selectInput &&
      (productName.includes(searchTerm) ||
        productCategory.includes(searchTerm) ||
        productDescription.includes(searchTerm))
    ) {
      return true;
    }
    return false;
  });

  return foundItems;
}

function displayCards(cards) {
  productContainer.innerHTML = "";
  if (cards.length === 0) {
    const noResults = document.createElement("p");
    noResults.textContent = "No results found";
    productContainer.appendChild(noResults);
  } else {
    cards.forEach((card) => {
      productContainer.appendChild(card);
    });
  }
}

searchInput.addEventListener("input", (event) => {
  const searchTerm = event.target.value.trim().toLowerCase();
  const selectInput = document.querySelector("#filter").value;

  const foundItems = filterCards(searchTerm, selectInput);
  displayCards(foundItems);
});
