export function menuHamburguer() {
  const btnMenu = document.querySelector(".btn-menu");
  const btnMenuIcon = document.querySelector("#icon-menu");
  const menu = document.querySelector(".links-menu");

  function closeMenu() {
    btnMenuIcon.classList.replace("fi-rr-cross", "fi-rr-menu-burger");
    btnMenu.setAttribute("aria-expanded", "false");
    btnMenu.setAttribute("aria-label", "Abrir menu da navegação");
  }

  btnMenu.addEventListener("click", () => {
    menu.classList.toggle("ativo");
    btnMenuIcon.classList.replace("fi-rr-menu-burger", "fi-rr-cross");
    btnMenu.setAttribute("aria-expanded", "true");
    btnMenu.setAttribute("aria-label", "Fechar menu da navegação");

    if (!menu.classList.contains("ativo")) {
      closeMenu();
      return;
    }
  });

  window.addEventListener("resize", () => {
    const windowWidth = window.innerWidth;
    // console.log(windowWidth);

    if (windowWidth > 768) {
      menu.classList.remove("ativo");
      closeMenu();
      return;
    }
  });
}
