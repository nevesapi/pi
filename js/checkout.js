const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
const container = document.getElementById("checkout");
const totalDisplay = document.getElementById("checkout-total");

if (cart.length === 0) {
  container.innerHTML = "<p>Seu carrinho está vazio.</p>";
  totalDisplay.textContent = "";
}

let total = 0;
cart.forEach((item) => {
  const subtotal = item.price * item.quantity;
  total += subtotal;

  const itemEl = document.createElement("div");
  itemEl.classList.add("checkout-items");
  itemEl.innerHTML = `
      <img src="${item.image}" alt="${item.name}"/>
      <div class='checkout-items-info'>
        <h4>${item.name}</h4>
        <p><strong>Qtde.:</strong> ${item.quantity}</p>
        <p><strong>Preço unitário</strong>: R$ ${item.price}</p>
        <p><strong>Subtotal</strong>: R$ ${subtotal.toFixed(2)}</p>
      </div>
      `;

  container.appendChild(itemEl);
});

totalDisplay.innerHTML = `<strong>Total: R$ ${total.toFixed(2)}</strong>`;
