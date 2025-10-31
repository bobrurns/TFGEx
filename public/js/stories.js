import axios from "axios";

module.exports.uploadStory = async (e) => {
  e.preventDefault();

  const formData = new FormData();

  formData.append(
    "firstContact",
    document.getElementById("firstContact").value
  );
  formData.append("promised", document.getElementById("promised").value);
  formData.append("realization", document.getElementById("realization").value);
  formData.append(
    "financialImpact",
    document.getElementById("financialImpact").value
  );
  formData.append(
    "victimContact",
    document.getElementById("victimContact").value
  );

  const finFiles = Array.from(
    document.getElementById("financialRecords").files
  );
  const commFiles = Array.from(
    document.getElementById("communicationRecords").files
  );
  const contFiles = Array.from(
    document.getElementById("contractsAgreements").files
  );

  console.log(finFiles);

  finFiles.forEach((file) => formData.append("financialRecords", file));
  commFiles.forEach((file) => formData.append("communicationRecords", file));
  contFiles.forEach((file) => formData.append("contractsAgreements", file));

  console.log("Sending data:", Array.from(formData.entries()));

  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/admin__dashboard",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.data.status === "success") {
      alert("Story uploaded successfully!");
      const uploadModal = document.getElementById("uploadModal");
      const uploadForm = document.getElementById("uploadForm");
      if (uploadModal) uploadModal.style.display = "none";
      if (uploadForm) uploadForm.reset();
      module.exports.searchStories();
    }
  } catch (err) {
    alert("Error uploading story: " + err.response.data.message);
  }
};

module.exports.searchStories = async () => {
  const searchInput = document.getElementById("searchInput");
  const resultsContainer = document.getElementById("resultsContainer");

  if (!searchInput || !resultsContainer) return;

  const query = searchInput.value.trim();

  try {
    let url = "/api/v1/stories";

    if (query) {
      if (query.includes(",")) {
        const ids = query
          .split(",")
          .map((id) => id.trim())
          .filter((id) => id);

        url = `/api/v1/stories?search=${encodeURIComponent(ids.join(","))}`;
      } else {
        url = `/api/v1/stories?search=${encodeURIComponent(query)}`;
      }
    }

    const res = await axios({
      method: "GET",
      url: url,
    });

    console.log("Search results:", res.data);
    displayStories(res.data.data.data || res.data.data);
  } catch (err) {
    console.error("Search error:", err);
    if (resultsContainer) {
      resultsContainer.innerHTML =
        '<p class="dashboard__placeholder">Error loading stories.</p>';
    }
  }
};

const displayStories = (stories) => {
  const resultsContainer = document.getElementById("resultsContainer");

  if (!resultsContainer) return;

  if (!stories || stories.length === 0) {
    resultsContainer.innerHTML =
      '<p class="dashboard__placeholder">No stories found.</p>';
    return;
  }

  resultsContainer.innerHTML = stories
    .map(
      (story) => `
    <div class="dashboard__story-card">
      <div class="dashboard__story-info">
        <p class="dashboard__story-id">Story ID: ${story.storyId}</p>
        <p class="dashboard__story-email">${story.victimContact}</p>
      </div>
      <div class="dashboard__story-actions">
        <button class="btn btn--small btn--edit" data-story-id="${story._id}">Edit</button>
        <button class="btn btn--small btn--delete" data-story-id="${story._id}">Delete</button>
      </div>
    </div>
  `
    )
    .join("");
};

module.exports.deleteStory = async (id) => {
  console.log(`deleting: ${id}`);
  if (!confirm("Are you sure you want to delete this story?")) return;

  try {
    await axios({
      method: "DELETE",
      url: `/api/v1/admin__dashboard/${id}`,
    });

    alert("Story deleted successfully!");

    module.exports.searchStories();
  } catch (err) {
    alert("Error deleting story: " + err.response.data.message);
  }
};

module.exports.updateStory = async (id, data) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/admin__dashboard/${id}`,
      data: data,
    });

    if (res.data.status === "success") {
      alert("Story updated successfully!");
      const updateModal = document.getElementById("updateModal");
      if (updateModal) updateModal.style.display = "none";
      module.exports.searchStories();
    }
  } catch (err) {
    alert("Error updating story: " + err.response.data.message);
  }
};
