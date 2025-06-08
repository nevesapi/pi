export function menuHamburguer() {
  const btnMenu = document.querySelector(".btn-menu");
  const btnMenuIcon = document.querySelector("#icon-menu");
  const menu = document.querySelector(".links-menu");

  function closeMenu() {
    btnMenuIcon.classList.replace("fi-rr-cross", "fi-rr-menu-burger");
    btnMenu.setAttribute("aria-expanded", "false");
    btnMenu.setAttribute("aria-label", "Abrir menu da navegação");
    menu.classList.remove("ativo");
    menu.hidden = true;
  }

  function openMenu() {
    btnMenuIcon.classList.replace("fi-rr-menu-burger", "fi-rr-cross");
    btnMenu.setAttribute("aria-expanded", "true");
    btnMenu.setAttribute("aria-label", "Fechar menu da navegação");
    menu.classList.add("ativo");
    menu.hidden = false;
  }

  menu.hidden = true;

  btnMenu.addEventListener("click", () => {
    const isActive = menu.classList.contains("ativo");

    if (isActive) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  window.addEventListener("resize", () => {
    const windowWidth = window.innerWidth;
    if (windowWidth > 768) {
      closeMenu();
      menu.hidden = false;
    }
  });
}
