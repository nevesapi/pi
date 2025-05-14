export function menuHamburguer() {
  const btnMenu = document.querySelector(".btn-menu");
  const btnMenuIcon = document.querySelector("#icon-menu");
  const menu = document.querySelector(".links-menu");

  btnMenu.addEventListener("click", () => {
    menu.classList.toggle("ativo");
    btnMenuIcon.classList.replace("fi-rr-menu-burger", "fi-rr-cross");
    btnMenu.setAttribute("aria-expanded", "true");
    btnMenu.setAttribute("aria-label", "Fechar menu da navegação");

    if (!menu.classList.contains("ativo")) {
      btnMenuIcon.classList.replace("fi-rr-cross", "fi-rr-menu-burger");
      btnMenu.setAttribute("aria-expanded", "false");
      btnMenu.setAttribute("aria-label", "Abrir menu da navegação");

      return;
    }
  });
}
