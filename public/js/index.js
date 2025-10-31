require("@babel/polyfill");

const { logIn, logOut } = require(`./login`);
const {
  uploadStory,
  searchStories,
  updateStory,
  deleteStory,
  displayStories,
} = require(`./stories`);

// Load file viewer for story pages
if (document.getElementById("fileModal")) {
  require("./fileViewer");
}

const loginForm = document.querySelector(`.form`);
const logOutBtn = document.querySelector(`.nav__item--logout`);

const uploadForm = document.getElementById("uploadForm");
const uploadBtn = document.getElementById("uploadBtn");
const uploadModal = document.getElementById("uploadModal");
const closeModal = document.querySelector(".modal__close");

const updateForm = document.getElementById("updateForm");
const updateModal = document.getElementById("updateModal");
const closeUpdateModal = document.querySelector(".modal__close--update");

const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("resultsContainer");

window.addEventListener("click", (e) => {
  if (e.target === uploadModal) {
    uploadModal.style.display = "none";
  }
  if (e.target === updateModal) {
    updateModal.style.display = "none";
  }
});

if (loginForm) {
  loginForm.addEventListener(`submit`, (e) => {
    e.preventDefault();
    const user = document.getElementById(`user`).value;
    const password = document.getElementById(`password`).value;

    logIn(user, password);
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener(`click`, logOut);
}

if (uploadBtn) {
  uploadBtn.addEventListener("click", () => {
    uploadModal.style.display = "block";
  });
}

if (closeModal) {
  closeModal.addEventListener("click", () => {
    uploadModal.style.display = "none";
  });
}

if (closeUpdateModal) {
  closeUpdateModal.addEventListener("click", () => {
    updateModal.style.display = "none";
  });
}

if (uploadForm) {
  uploadForm.addEventListener("submit", (e) => uploadStory(e));
}

if (updateForm) {
  updateForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const storyId = document.getElementById("updateStoryId").value;
    const data = {
      firstContact: document.getElementById("updateFirstContact").value,
      promised: document.getElementById("updatePromised").value,
      realization: document.getElementById("updateRealization").value,
      financialImpact: document.getElementById("updateFinancialImpact").value,
      victimContact: document.getElementById("updateVictimContact").value,
    };

    await updateStory(storyId, data);
  });
}

if (searchBtn) {
  searchBtn.addEventListener("click", searchStories);
}

if (searchInput) {
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchStories();
    }
  });
}

// EVENT DELEGATION for dynamically created buttons
if (resultsContainer) {
  resultsContainer.addEventListener("click", async (e) => {
    e.preventDefault();
    const deleteBtn = e.target.closest(".btn--delete");
    const editBtn = e.target.closest(".btn--edit");

    if (deleteBtn) {
      const storyId = deleteBtn.dataset.storyId;
      await deleteStory(storyId);
    }

    if (editBtn) {
      const storyId = editBtn.dataset.storyId;

      // Get the story data from the card
      const storyCard = editBtn.closest(".dashboard__story-card");
      const storyIdText = storyCard
        .querySelector(".dashboard__story-id")
        .textContent.replace("Story ID: ", "");
      const email = storyCard.querySelector(
        ".dashboard__story-email"
      ).textContent;

      // Fetch full story details from API
      try {
        const res = await fetch(
          `/api/v1/stories?search=${encodeURIComponent(storyIdText)}`
        );
        const data = await res.json();

        if (data.data.data && data.data.data.length > 0) {
          const story = data.data.data[0];

          // Prefill the update form
          document.getElementById("updateStoryId").value = story._id;
          document.getElementById("updateFirstContact").value =
            story.firstContact;
          document.getElementById("updatePromised").value = story.promised;
          document.getElementById("updateRealization").value =
            story.realization;
          document.getElementById("updateFinancialImpact").value =
            story.financialImpact;
          document.getElementById("updateVictimContact").value =
            story.victimContact;

          // Show the modal
          updateModal.style.display = "block";
        }
      } catch (err) {
        alert("Error loading story details: " + err.message);
      }
    }
  });

  searchStories();
}
