const containerCard = document.querySelector("#mais-pedidos");
const btnPrev = document.querySelector(".slider-btn.prev");
const btnNext = document.querySelector(".slider-btn.next");

const scrollAmount = 355;

btnPrev.addEventListener("click", () => {
  containerCard.scrollBy({
    left: -scrollAmount,
    behavior: "smooth",
  });
});

btnNext.addEventListener("click", () => {
  containerCard.scrollBy({
    left: scrollAmount,
    behavior: "smooth",
  });
});

async function loadContent() {
  try {
    const response = await fetch("http://localhost:3000/api/products");
    const data = await response.json();
    console.log(data);

    data.forEach((product) => {
      const cardHTML = `
        <div class="card-produto">
          <img
            src="${product.image}"
            alt="${product.name}"
          />
          <h3>${product.name}</h3>
          <span>${product.description}</span>
          
          <div class="button-container">
            <button class="remove" aria-label="Botão de remover o ${product.name} do carrinho">
              <i class="fi fi-rr-minus"></i>
            </button>

            <p class="price">R$${product.price}</p>

            <button class="add" aria-label="Botão de adicionar o ${product.name} do carrinho">
              <i class="fi fi-rr-add"></i>
            </button>
          </div>
        </div>
      `;

      containerCard.insertAdjacentHTML("beforeend", cardHTML);
    });
  } catch (error) {
    console.log("Falha ao carregar o conteudo: " + error);
  }
}

loadContent();
