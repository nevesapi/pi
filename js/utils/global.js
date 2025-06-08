export function formatPrice(price) {
  return Number(price).toFixed(2).replace(".", ",");
}

export function setFormStatus(item, message, color) {
  item.textContent = message;
  item.style.color = color;
}
