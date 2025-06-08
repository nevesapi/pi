const btnHidePassword = document.querySelector(".btn-hide-password");
const inputPassword = document.querySelector(".password input");
const btnIcon = btnHidePassword.querySelector("i");

btnHidePassword.setAttribute("aria-pressed", "false");

btnHidePassword.addEventListener("click", () => {
  const isPassword = inputPassword.getAttribute("type") === "password";

  inputPassword.setAttribute("type", isPassword ? "text" : "password");
  inputPassword.focus();

  btnIcon.classList.replace(
    isPassword ? "fi-rr-eye" : "fi-rr-eye-crossed",
    isPassword ? "fi-rr-eye-crossed" : "fi-rr-eye"
  );

  btnHidePassword.setAttribute("aria-pressed", String(isPassword));
  btnHidePassword.setAttribute("aria-label", isPassword ? "Ocultar senha" : "Mostrar senha");
});