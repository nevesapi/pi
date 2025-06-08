export function autHeader() {
  const userData = sessionStorage.getItem("user");
  const navLinks = document.querySelector(".links-menu");

  if (!userData || !navLinks) return;

  const user = JSON.parse(userData);
  const firstName = user.name?.split(" ")[0] || "Usuário";

  const loginLink = navLinks.querySelector('a[href="login.html"]');
  if (loginLink?.parentElement) {
    loginLink.parentElement.remove();
  }

  const userInfo = document.createElement("li");
  userInfo.innerHTML = `
    <a href="dashboard.html"
       class="user-info flex-ai-jc-center"
       aria-label="Ir para o painel de ${firstName}"
       title="Painel do usuário">
      <span>Olá, ${firstName}</span>
      <i class="fi fi-rr-user-pen flex-ai-jc-center" aria-hidden="true"></i>
    </a>
  `;

  const userLogout = document.createElement("li");
  userLogout.innerHTML = `
    <button id="logout-btn"
      type="button"
      class="flex-ai-jc-center"
      aria-label="Fazer logout do sistema"
      title="Sair">
      <span>Sair</span>
      <i class="fi fi-rr-exit flex-ai-jc-center" aria-hidden="true"></i>
    </button>
  `;

  navLinks.appendChild(userInfo);
  navLinks.appendChild(userLogout);

  document.getElementById("logout-btn").addEventListener("click", () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("userInfo");
    sessionStorage.removeItem("cart");
    window.location.reload();
  });
}
