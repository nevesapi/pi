import { API_BASE_URL } from "./apiConfig.js";
import { setFormStatus } from "./utils/global.js";

const form = document.querySelector("#form-register");
const nome = document.querySelector("#nome");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const statusForm = document.querySelector("#my-form-status");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nomeValue = nome.value.trim();
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();

  if (!nomeValue || !emailValue || !passwordValue)
    return setFormStatus(
      statusForm,
      "Por favor, preencha todos os campos!",
      "white"
    );

  try {
    const response = await fetch(`${API_BASE_URL}/api/users/cadastro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nomeValue,
        email: emailValue,
        password: passwordValue,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return setFormStatus(statusForm, data.message, "white");
    }
    
    setFormStatus(statusForm, data.message, "white");
    sessionStorage.setItem("user", JSON.stringify(data.user));
    window.location.href = "dashboard.html";
  } catch (error) {
    console.log(error);
    setFormStatus(
      statusForm,
      "Ops, erro ao cadastrar usuário. Tente novamente!",
      "white"
    );
  }
});
