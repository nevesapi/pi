import { API_BASE_URL } from "./apiConfig.js";
import { setFormStatus } from "./utils/global.js";
import { getUser, saveUser, saveUserInfo } from "./utils/userUtils.js";

const user = getUser();
const ordersContainer = document.querySelector(".orders");

if (!user) {
  window.location.href = "login.html";
}

const userNameInput = document.getElementById("name");
const userEmailInput = document.getElementById("email");

userNameInput.value = user?.name || "";
userEmailInput.value = user?.email || "";

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
    const dateOrder = new Date(data.order_date)
      .toLocaleString()
      .replace(",", "");

    const orderElement = document.createElement("article");
    orderElement.classList.add("order");
    orderElement.setAttribute("aria-label", `Pedido número ${id}`);
    orderElement.setAttribute("role", "region");
    orderElement.setAttribute("tabindex", "0");

    const itemsHTML = data.items.map(creteOrderListItem).join("");

    orderElement.innerHTML = `
      <h3>Pedido #${id} <span> - </span>
      <time datetime="${data.order_date}">${dateOrder}</time></h3>
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

function creteOrderListItem(item) {
  const itemSubTotal = formatPrice(item.quantity * item.item_price);
  const itemRenderQuantity =
    item.quantity > 1 ? "<span> @ </span> R$ " + itemSubTotal : "";

  return `<li>${item.name} — x${item.quantity} R$ ${formatPrice(
    item.item_price
  )} ${itemRenderQuantity} </li>`;
}

const updateForm = document.getElementById("formProfile-dashboard");
const spanMessage = document.getElementById("form-status");

updateForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const updatedName = userNameInput.value.trim();
  const updatedEmail = userEmailInput.value.trim();

  const nameChanged = updatedName !== user?.name;
  const emailChanged = updatedEmail !== user?.email;

  if (!nameChanged && !emailChanged) {
    return setFormStatus(spanMessage, "Atualizado com sucesso", "#465940");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${user?.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...(nameChanged && { name: updatedName }),
        ...(emailChanged && { email: updatedEmail }),
      }),
    });

    const data = await response.json();
    console.log(data);

    if (!response.ok)
      return setFormStatus(
        spanMessage,
        "Falha ao tentar atualizar dados",
        "#ff0000"
      );

    const updatedUser = {
      ...user,
      ...(nameChanged && { name: updatedName }),
      ...(emailChanged && { email: updatedEmail }),
    };

    saveUser(updatedUser);
    saveUserInfo(updatedUser);

    setFormStatus(spanMessage, data.message, "#465940");
    window.location.reload();
  } catch (error) {
    console.error(error);
    setFormStatus(spanMessage, "Falha ao atualizar dados!", "#ff0000");
  }
});
