import { API_BASE_URL } from "./apiConfig.js";

const SCROLL_AMOUNT = 355;
const page = window.location.pathname;

const CATEGORY_LABELS = {
  bebida: "Bebidas",
  doce: "Doces",
  salgado: "Salgados",
};

function formatPrice(product) {
  return Number(product).toFixed(2).replace(".", ",");
}

function createProductCard(product) {
  return `
    <div class="card-produto" data-id="${product.id}">
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <span>${product.description}</span>
      <div class="button-container flex-aic-jc-sb">
        <button class="remove flex-ai-jc-center" aria-label="Botão de remover">
          <i class="fi fi-rr-minus flex-ai-jc-center"></i>
        </button>
        <p class="price">R$${formatPrice(product.price)}</p>
        <button class="add flex-ai-jc-center" aria-label="Botão de adicionar">
          <i class="fi fi-rr-add flex-ai-jc-center"></i>
        </button>
      </div>
    </div>
  `;
}

function setupScrollButtons(container) {
  const containerSlider = container.closest(".container-card-slider");
  if (!containerSlider) return;

  const btnPrev = containerSlider.querySelector(".slider-btn.prev");
  const btnNext = containerSlider.querySelector(".slider-btn.next");

  if (btnPrev) {
    btnPrev.addEventListener("click", () => {
      container.scrollBy({
        left: -SCROLL_AMOUNT,
        behavior: "smooth",
      });
    });
  }

  if (btnNext) {
    btnNext.addEventListener("click", () => {
      container.scrollBy({
        left: SCROLL_AMOUNT,
        behavior: "smooth",
      });
    });
  }
}

function renderProductsByCategory(products, category, containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const containerSlider = container.closest(".container-card-slider");

  if (containerSlider) {
    const title = containerSlider.querySelector("h3");
    if (title) {
      title.textContent =
        category.charAt(0).toUpperCase() + category.slice(1) + "s";
    }
  }

  const filtered = products.filter((product) => product.category === category);

  filtered.forEach((product) => {
    const cardHTML = createProductCard(product);
    container.insertAdjacentHTML("beforeend", cardHTML);
  });

  setupScrollButtons(container);
}

async function loadContent() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`);
    const data = await response.json();

    if (page.includes("/")) {
      renderProductsByCategory(data, "bebida", "#mais-pedidos");
    }

    if (page.includes("cardapio.html")) {
      renderProductsByCategory(data, "doce", "#doces");
      renderProductsByCategory(data, "bebida", "#bebidas");
      renderProductsByCategory(data, "salgado", "#salgados");
    }
  } catch (error) {
    console.error("Falha ao carregar o conteúdo:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadContent);
