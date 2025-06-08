import { updateCartCounter } from "./cartCounter.js";
import { getCart, saveCart } from "./utils/cartUtils.js";
import { renderCart } from "./renderCart.js";

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
    window.location.href = "checkout.html";
  });

  function safeRenderCartIfExists() {
    const container = document.getElementById("checkout");
    const totalDisplay = document.getElementById("checkout-total");
    if (container && totalDisplay) {
      renderCart(container, totalDisplay);
    }
  }

  function showCartItems() {
    const cart = getCart() || [];
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML =
        "<p class='messageModal'>Seu carrinho está vazio.</p>";
      checkoutBtn.style.display = "none";
      return;
    }

    checkoutBtn.style.display = "flex";

    cart.forEach((item, index) => {
      const itemPrice = formatPrice(item.price);
      const subtotalPrice = formatPrice(item.price * item.quantity);
      const itemRenderQuantity =
        item.quantity > 1 ? "<span> @ </span> R$ " + subtotalPrice : "";

      const itemDiv = document.createElement("div");
      itemDiv.classList.add("cart-item", "flex-aic-jc-sb");
      itemDiv.innerHTML = `
          <img src="${item.image}" alt="${item.name}" width="60" />
          <div>
            <h4>${item.name}</h4>
            <p>x${item.quantity} - R$ ${itemPrice} ${itemRenderQuantity}</p>
            <div class="checkout-button flex-aic-jc-fe">
              <button type="button" class="btn remove flex-ai-jc-center"> - </button>
              <button type="button" class="btn add flex-ai-jc-center"> + </button>
            </div>
          </div>
        `;

      const addBtn = itemDiv.querySelector(".add");
      const removeBtn = itemDiv.querySelector(".remove");

      addBtn.addEventListener("click", () => {
        cart[index].quantity += 1;
        saveCart(cart);
        showCartItems();
        updateCartCounter();
        safeRenderCartIfExists();
      });

      removeBtn.addEventListener("click", () => {
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
        } else {
          cart.splice(index, 1);
        }
        saveCart(cart);
        showCartItems();
        updateCartCounter();
        safeRenderCartIfExists();
      });
      cartItemsContainer.appendChild(itemDiv);
    });
  }

  function formatPrice(value) {
    return value.toFixed(2).replace(".", ",");
  }
}
