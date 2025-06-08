import { API_BASE_URL } from "./apiConfig.js";
import { setFormStatus } from "./utils/global.js";

const formLogin = document.querySelector("#form-login");
const statusForm = document.querySelector("#my-form-status");

const email = document.querySelector("#email");
const password = document.querySelector("#password");

formLogin.addEventListener("submit", async (event) => {
  event.preventDefault();

  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();

  if (!emailValue || !passwordValue) return setFormStatus(statusForm, "Preencha todos os campos!", "white");

  try {
    const response = await fetch(`${API_BASE_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailValue,
        password: passwordValue,
      }),
    });

    const data = await response.json();

    if (!response.ok) return setFormStatus(statusForm, data.message, "white");
      
      setFormStatus(statusForm, data.message, "white");
      sessionStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "dashboard.html";
  } catch (error) {
    console.log(error);
    setFormStatus(statusForm, "Ops, falha ao fazer login. Tente novamente", "white");
  }
});
