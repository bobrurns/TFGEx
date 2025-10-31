// File Viewer Modal with Gallery Navigation
let currentGallery = [];
let currentIndex = 0;

const modal = document.getElementById("fileModal");
const modalImage = document.getElementById("modalImage");
const modalPDF = document.getElementById("modalPDF");
const closeBtn = document.querySelector(".file-modal__close");
const prevBtn = document.querySelector(".file-modal__prev");
const nextBtn = document.querySelector(".file-modal__next");
const caption = document.querySelector(".file-modal__caption");

// Open modal when clicking on any file card
document.querySelectorAll(".story-detail__file-card").forEach((card) => {
  card.addEventListener("click", function () {
    const filePath = this.dataset.file;
    const gallery = this.dataset.gallery;

    // Get all files in the same gallery
    currentGallery = Array.from(
      document.querySelectorAll(`[data-gallery="${gallery}"]`)
    ).map((el) => ({
      path: el.dataset.file,
      name:
        el.querySelector(".file-name")?.textContent ||
        el.querySelector("img")?.alt ||
        "",
    }));

    // Find current index
    currentIndex = currentGallery.findIndex((item) => item.path === filePath);

    showFile(currentIndex);
    modal.style.display = "flex";
  });
});

// Show file at specific index
function showFile(index) {
  if (index < 0 || index >= currentGallery.length) return;

  currentIndex = index;
  const file = currentGallery[index];
  const isPDF = file.path.toLowerCase().endsWith(".pdf");

  if (isPDF) {
    modalImage.style.display = "none";
    modalPDF.style.display = "block";
    modalPDF.src = file.path;
  } else {
    modalPDF.style.display = "none";
    modalImage.style.display = "block";
    modalImage.src = file.path;
  }

  caption.textContent = `${currentIndex + 1} / ${currentGallery.length} - ${file.name}`;

  // Show/hide navigation buttons
  prevBtn.style.display = currentGallery.length > 1 ? "block" : "none";
  nextBtn.style.display = currentGallery.length > 1 ? "block" : "none";
}

// Navigation
prevBtn?.addEventListener("click", () => {
  showFile((currentIndex - 1 + currentGallery.length) % currentGallery.length);
});

nextBtn?.addEventListener("click", () => {
  showFile((currentIndex + 1) % currentGallery.length);
});

// Close modal
closeBtn?.addEventListener("click", () => {
  modal.style.display = "none";
  modalPDF.src = "";
  modalImage.src = "";
});

// Close on outside click
modal?.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    modalPDF.src = "";
    modalImage.src = "";
  }
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (modal.style.display === "flex") {
    if (e.key === "Escape") closeBtn.click();
    if (e.key === "ArrowLeft") prevBtn.click();
    if (e.key === "ArrowRight") nextBtn.click();
  }
});
