import { autHeader } from "./authHeader.js";
import { menuHamburguer } from "./menu.js";
import { modal } from "./modal.js";
import { shopCart } from "./shopCart.js";

document.addEventListener("DOMContentLoaded", () => {
  menuHamburguer();
  shopCart();
  modal();
  autHeader();
});
