const btnPrev = document.querySelector(".slider-btn.prev");
const btnNext = document.querySelector(".slider-btn.next");

const scrollAmount = 355;

function renderProductsByCategory(products, category, containerSelector) {
  const container = document.querySelector(containerSelector);
  const filtered = products.filter((product) => product.category === category);

  btnPrev.addEventListener("click", () => {
    container.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  });

  btnNext.addEventListener("click", () => {
    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  });

  filtered.forEach((product) => {
    const cardHTML = `
      <div class="card-produto">
        <img
          src="${product.image}"
          alt="${product.name}"
          width="358px"
          height="356px"
        />
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
    container.insertAdjacentHTML("beforeend", cardHTML);
  });
}

async function loadContent() {
  try {
    const response = await fetch("http://localhost:3000/api/products");
    const data = await response.json();

    renderProductsByCategory(data, "bebida", "#mais-pedidos");
    // renderProductsByCategory(data, "doce", "#doces");
    // renderProductsByCategory(data, "bebida", "#bebidas");
    // renderProductsByCategory(data, "salgado", "#salgados");
  } catch (error) {
    console.log("Falha ao carregar o conteúdo: " + error);
  }
}

loadContent();
