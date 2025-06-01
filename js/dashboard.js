import { API_BASE_URL } from "./apiConfig.js";

const user = JSON.parse(sessionStorage.getItem("user"));
const ordersContainer = document.querySelector(".orders");

if (!user) {
  window.location.href = "login.html";
}

const userName = (document.getElementById("name").value = user?.name);
const userEmail = (document.getElementById("email").value = user?.email);

fetchOrders(user?.id);

async function fetchOrders(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders/${userId}`);
    const orders = await response.json();

    if (!orders.length) {
      ordersContainer.innerHTML = "<p>Você ainda não fez nenhum pedido.</p>";
      return;
    }

    const groupedOrders = groupOrdersById(orders);
    renderOrders(groupedOrders);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    ordersContainer.innerHTML = "<p>Erro ao carregar pedidos.</p>";
  }
}

function groupOrdersById(orders) {
  return orders.reduce((acc, order) => {
    const {
      order_id,
      order_date,
      order_total,
      item_name,
      item_quantity,
      item_total_price,
      item_price,
    } = order;

    console.log(order);

    if (!acc[order_id]) {
      acc[order_id] = {
        order_date,
        order_total,
        items: [],
      };
    }

    acc[order_id].items.push({
      name: item_name,
      quantity: item_quantity,
      item_total: item_total_price,
      item_price: item_price,
    });

    return acc;
  }, {});
}

function renderOrders(orders) {
  ordersContainer.innerHTML = "";

  Object.entries(orders).forEach(([id, data]) => {
    const orderElement = document.createElement("div");
    orderElement.classList.add("order");

    console.log(data);

    const itemsHTML = data.items
      .map(
        (item) =>
          `<li>${item.quantity}x ${item.name} — R$ ${formatPrice(
            item.item_price
          )}</li>`
      )
      .join("");

    orderElement.innerHTML = `
      <h3>Pedido #${id} <span> - </span>
      <strong>${new Date(data.order_date)
        .toLocaleString()
        .replace(",", "")}</strong></h3>
      <ul>${itemsHTML}</ul>
      <p><strong>Total do Pedido:</strong> R$ ${formatPrice(
        data.order_total
      )}</p>
    `;

    ordersContainer.appendChild(orderElement);
  });
}

function formatPrice(price) {
  return Number(price).toFixed(2).replace(".", ",");
}
