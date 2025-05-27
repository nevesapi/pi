const SCROLL_AMOUNT = 355;
const page = window.location.pathname;

const CATEGORY_LABELS = {
  bebida: "Bebidas",
  doce: "Doces",
  salgado: "Salgados",
};

function createProductCard(product) {
  return `
    <div class="card-produto" data-id="${product.id}">
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <span>${product.description}</span>
      <div class="button-container">
        <button class="remove" aria-label="Botão de remover">
          <i class="fi fi-rr-minus"></i>
        </button>
        <p class="price">R$${product.price}</p>
        <button class="add" aria-label="Botão de adicionar">
          <i class="fi fi-rr-add"></i>
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

  // console.log(btnNext);
  // console.log(btnPrev);

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
    const response = await fetch("http://localhost:3000/api/products");
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
