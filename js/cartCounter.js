import { getCart, saveCart } from "./utils/cartUtils.js";

export function updateCartCounter() {
  const spanCount =
    document.querySelector(".cart span") || document.createElement("span");
  const cartIcon = document.querySelector(".cart i");
  if (!cartIcon) return;

  const cartItems = getCart() || [];
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  spanCount.classList = "flex-ai-jc-center";

  if (totalQuantity > 0) {
    spanCount.textContent = totalQuantity;
    if (!cartIcon.contains(spanCount)) {
      cartIcon.appendChild(spanCount);
    }
  } else {
    if (cartIcon.contains(spanCount)) {
      cartIcon.removeChild(spanCount);
    }
  }
}
