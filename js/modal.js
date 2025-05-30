export function modal() {
  const cartIcon = document.querySelector(".cart");
  const modal = document.getElementById("cart-modal");
  const cartItemsContainer = document.getElementById("cart-items");
  const closeModalBtn = document.getElementById("close-modal");
  const checkoutBtn = document.getElementById("checkout-btn");

  if (!cartIcon || !modal) return;

  cartIcon.addEventListener("click", (e) => {
    e.preventDefault();
    showCartItems();
    modal.classList.remove("hidden");
  });

  closeModalBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  checkoutBtn.addEventListener("click", () => {
    window.location.href = "/checkout.html";
  });

  function showCartItems() {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML =
        "<p class='messageModal'>Seu carrinho está vazio.</p>";
      checkoutBtn.style.display = "none";
      return;
    }

    checkoutBtn.style.display = "flex";

    cart.forEach((item) => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("cart-item");
      itemDiv.innerHTML = `
          <img src="${item.image}" alt="${item.name}" width="60" />
          <div>
            <h4>${item.name}</h4>
            <p>Qtd.: ${item.quantity}</p>
            <p>Total: R$ ${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        `;
      cartItemsContainer.appendChild(itemDiv);
    });
  }
}
