export function shopCart() {
  const spanCount = document.createElement("span");
  const cart = document.querySelector(".cart i");

  if (!cart) return;

  let cartItems = JSON.parse(sessionStorage.getItem("cart")) || [];

  updateCartCounter();

  document.addEventListener("click", (event) => {
    const addBtn = event.target.closest("button.add");
    const removeBtn = event.target.closest("button.remove");

    if (!addBtn && !removeBtn) return;

    const card = (addBtn || removeBtn).closest(".card-produto");
    if (!card) return;

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

    saveCart();
    updateCartCounter();
  });

  function updateCartCounter() {
    const totalQuantity = cartItems.reduce(
      (acc, item) => acc + item.quantity,
      0
    );

    if (totalQuantity > 0) {
      spanCount.textContent = totalQuantity;
      if (!cart.contains(spanCount)) {
        cart.appendChild(spanCount);
      }
    } else {
      if (cart.contains(spanCount)) {
        cart.removeChild(spanCount);
      }
    }
  }

  function saveCart() {
    sessionStorage.setItem("cart", JSON.stringify(cartItems));
  }
}
