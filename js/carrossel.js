const containerCard = document.querySelector(".container-card");
const btnPrev = document.querySelector(".slider-btn.prev");
const btnNext = document.querySelector(".slider-btn.next");

console.log("containerCard: ", containerCard);
console.log("btnNext: ", btnNext);
console.log("btnPrev: ", btnPrev);

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
