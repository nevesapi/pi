export function getCart() {
  return JSON.parse(sessionStorage.getItem("cart")) || [];
}

export function saveCart(value) {
  sessionStorage.setItem("cart", JSON.stringify(value));
}
