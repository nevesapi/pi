import { updateCartCounter } from "./cartCounter.js";
import { getCart, saveCart } from "./utils/cartUtils.js";
import { formatPrice } from "./utils/global.js";

export function renderCart(container, totalDisplay) {
  let cartItems = getCart();
  container.innerHTML = "";

  if (cartItems.length === 0) {
    container.innerHTML = "<p>Seu carrinho está vazio.</p>";
    totalDisplay.textContent = "";
    return;
  }

  let total = 0;

  cartItems.forEach((item, index) => {
    const subtotal = item.price * item.quantity;

    const itemRenderQuantity =
      item.quantity > 1 ? "<span> @ </span> R$" + formatPrice(subtotal) : "";
    total += subtotal;

    const itemEl = document.createElement("div");
    itemEl.classList.add("checkout-items");
    itemEl.innerHTML = `
      <img src="${item.image}" alt="${item.name}"/>
      <div class='checkout-items-info'>
        <h4>${item.name}</h4>
        <p>${item.quantity}x R$ ${formatPrice(
      item.price
    )} ${itemRenderQuantity}</p>
        <div class="checkout-button flex-ai-center">
          <button type="button" class="btn remove flex-ai-jc-center"> - </button>
          <button type="button" class="btn add flex-ai-jc-center"> + </button>
        </div>
      </div>
    `;

    const addBtn = itemEl.querySelector(".add");
    const removeBtn = itemEl.querySelector(".remove");

    addBtn.addEventListener("click", () => {
      cartItems[index].quantity += 1;
      saveCart(cartItems);
      renderCart(container, totalDisplay);
      updateCartCounter();
    });

    removeBtn.addEventListener("click", () => {
      if (cartItems[index].quantity > 1) {
        cartItems[index].quantity -= 1;
      } else {
        cartItems.splice(index, 1);
      }
      saveCart(cartItems);
      renderCart(container, totalDisplay);
      updateCartCounter();
    });

    container.appendChild(itemEl);
  });

  totalDisplay.innerHTML = `<strong>Total: R$ ${formatPrice(total)}</strong>`;
}
