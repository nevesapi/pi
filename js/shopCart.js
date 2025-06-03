import { updateCartCounter } from "./cartCounter.js";
import { getCart, saveCart } from "./utils/cartUtils.js";

export function shopCart() {
  const spanCount = document.createElement("span");
  const cart = document.querySelector(".cart i");

  if (!cart) return;

  updateCartCounter();
  spanCount.classList = "flex-ai-jc-center";

  document.addEventListener("click", (event) => {
    const addBtn = event.target.closest("button.add");
    const removeBtn = event.target.closest("button.remove");

    if (!addBtn && !removeBtn) return;

    const card = (addBtn || removeBtn).closest(".card-produto");
    if (!card) return;

    let cartItems = getCart();

    const product = {
      id: card.dataset.id,
      name: card.querySelector("h3").textContent,
      description: card.querySelector("span").textContent,
      price: parseFloat(
        card
          .querySelector(".price")
          .textContent.replace("R$", "")
          .replace(",", ".")
      ),
      image: card.querySelector("img").getAttribute("src"),
      quantity: 1,
    };

    if (addBtn) {
      const existing = cartItems.find((item) => item.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cartItems.push(product);
      }

      const icon = addBtn.querySelector("i");
      if (icon) {
        icon.classList.add("icon-feedback");

        const originalClass = icon.className;
        icon.className = "fi fi-rr-check";

        setTimeout(() => {
          icon.className = originalClass;
          icon.classList.remove("icon-feedback");
        }, 1000);
      }
    }

    if (removeBtn) {
      const index = cartItems.findIndex((item) => item.id === product.id);
      if (index !== -1) {
        if (cartItems[index].quantity > 1) {
          cartItems[index].quantity -= 1;
        } else {
          cartItems.splice(index, 1);
        }
      }
    }

    saveCart(cartItems);
    updateCartCounter();
  });
}
