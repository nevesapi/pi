import { API_BASE_URL } from "./apiConfig.js";

const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
const container = document.getElementById("checkout");
const totalDisplay = document.getElementById("checkout-total");
const form = document.getElementById("form-search");
const statusForm = document.getElementById("my-form-status");

const userInfoData = sessionStorage.getItem("userInfo");
const userLogged = sessionStorage.getItem("user");
const addressData = sessionStorage.getItem("address");

function formatPrice(value) {
  return value.toFixed(2).replace(".", ",");
}

// carrinho
if (cart.length === 0) {
  container.innerHTML = "<p>Seu carrinho está vazio.</p>";
  totalDisplay.textContent = "";
} else {
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
          <p>${item.quantity}x R$ ${formatPrice(
      item.price
    )} <span>@</span> R$ ${formatPrice(subtotal)}</p>
    `;
    container.appendChild(itemEl);
  });

  totalDisplay.innerHTML = `<strong>Total: R$ ${formatPrice(total)}</strong>`;
}

if (userLogged && !userInfoData) {
  sessionStorage.setItem("userInfo", userLogged);
  location.reload();
}

if (userInfoData) {
  const user = JSON.parse(userInfoData);
  form.style.display = "none";

  const userInfo = document.createElement("div");
  userInfo.classList.add("checkout-user-info", "flex-col");
  userInfo.innerHTML = `
    <p><strong>Nome:</strong> ${user?.name}</p>
    <p><strong>Email:</strong> ${user?.email}</p>
  `;
  form.parentNode.insertBefore(userInfo, form);

  renderCepForm();
}

// search user por e-mail
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  if (!email) return;

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/users?email=${encodeURIComponent(email)}`
    );

    const data = await response.json();
    if (!response.ok || !data.user) {
      statusForm.textContent = "Falha ao buscar usuário. Tente novamente!";
      statusForm.style.color = "red";
      return;
    }

    const user = data.user;
    sessionStorage.setItem("userInfo", JSON.stringify(user));
    form.style.display = "none";

    const userInfo = document.createElement("div");
    userInfo.classList.add("checkout-user-info");
    userInfo.innerHTML = `
      <p><strong>Nome:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
    `;
    form.parentNode.insertBefore(userInfo, form);

    renderCepForm();
  } catch (error) {
    console.log(error);
    statusForm.textContent = "Falha ao realizar busca";
    statusForm.style.color = "red";
  }
});

// CEP
function renderCepForm() {
  if (document.getElementById("form-cep")) return;

  const cepForm = document.createElement("form");
  cepForm.id = "form-cep";
  cepForm.innerHTML = `
    <input type="text" id="cep" name="cep" placeholder="Digite seu CEP" required pattern="\\d{5}-?\\d{3}" />
    <button type="submit" class="flex-ai-jc-center">Buscar Endereço</button>
  `;
  form.parentNode.insertBefore(cepForm, form.nextSibling);

  // status do CEP (vou deoxar fora do form)
  const status = document.createElement("div");
  status.id = "cep-status";
  status.style.marginTop = "10px";
  cepForm.parentNode.insertBefore(status, cepForm.nextSibling);

  // btn finaliza pedido
  const finalizeBtn = document.createElement("button");
  finalizeBtn.textContent = "Finalizar Pedido";
  finalizeBtn.disabled = true;
  finalizeBtn.id = "finalize-order";
  finalizeBtn.className = "flex-ai-jc-center";
  finalizeBtn.style.marginTop = "20px";
  status.parentNode.insertBefore(finalizeBtn, status.nextSibling);

  // to maluco já, aqui é o endereço salvo do sessionStorage
  if (addressData) {
    const addr = JSON.parse(addressData);
    status.innerHTML = `
      ${addr.logradouro}<br>
      ${addr.bairro}<br>
      ${addr.localidade} - ${addr.uf}
    `;
    status.style.color = "#465940";
    finalizeBtn.disabled = false;
  }

  cepForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const cep = document.getElementById("cep").value.replace(/\D/g, "");

    if (!cep.match(/^\d{8}$/)) {
      status.textContent = "CEP inválido.";
      status.style.color = "red";
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        status.textContent = "CEP não encontrado.";
        status.style.color = "red";
      } else {
        sessionStorage.setItem("address", JSON.stringify(data));
        status.innerHTML = `
          ${data.logradouro}<br>
          ${data.bairro}<br>
          ${data.localidade} - ${data.uf}
        `;
        status.style.color = "#617b59";
        finalizeBtn.disabled = false;
      }
    } catch (error) {
      console.log(error);
      status.textContent = "Erro ao buscar o CEP.";
      status.style.color = "red";
    }
  });

  finalizeBtn.addEventListener("click", async () => {
    const user = JSON.parse(sessionStorage.getItem("userInfo"));
    const address = JSON.parse(sessionStorage.getItem("address"));
    const cartData = JSON.parse(sessionStorage.getItem("cart")) || [];

    if (!user || !address || cartData.length === 0) {
      alert("Dados incompletos para finalizar o pedido.");
      return;
    }

    finalizeBtn.disabled = true;
    finalizeBtn.textContent = "Enviando pedido...";

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          email: user.email,
          items: cartData.map((item) => ({
            product_id: item.id,
            product_name: item.name,
            quantity: item.quantity,
            unit_price: item.price,
          })),
          address: address,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar pedido.");
      }

      sessionStorage.removeItem("cart");
      sessionStorage.removeItem("userInfo");
      sessionStorage.removeItem("address");

      finalizeBtn.textContent = "Pedido enviado com sucesso!";
      finalizeBtn.style.backgroundColor = "green";
      finalizeBtn.style.color = "#fff";

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error(error);
      finalizeBtn.disabled = false;
      finalizeBtn.textContent = "Finalizar Pedido";
      alert("Erro ao finalizar o pedido. Tente novamente.");
    }
  });
}
