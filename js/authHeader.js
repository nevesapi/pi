export function autHeader() {
  const userData = sessionStorage.getItem("user");
  const navLinks = document.querySelector(".links-menu");

  if (userData && navLinks) {
    const user = JSON.parse(userData);

    const loginLink = navLinks.querySelector('a[href="login.html"]');
    if (loginLink) {
      loginLink.parentElement.remove();
    }

    const userInfo = document.createElement("li");
    const userLogout = document.createElement("li");
    userInfo.innerHTML = `<a href="dashboard.html" class="user-info flex-ai-jc-center">Olá, ${
      user.name.split(" ")[0]
    }<i class="fi fi-rr-user-pen flex-ai-jc-center"></a>`;
    userLogout.innerHTML = `
      <button id="logout-btn" class="flex-ai-jc-center" type='button'"> <span>Sair</span> <i class="fi fi-rr-exit flex-ai-jc-center"></i></button>`;
    navLinks.appendChild(userInfo);
    navLinks.appendChild(userLogout);

    document.getElementById("logout-btn").addEventListener("click", () => {
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("userInfo");
      sessionStorage.removeItem("cart");
      window.location.reload();
    });
  }
}
