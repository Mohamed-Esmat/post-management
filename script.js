let posts = [];
let currentEditId = null;
initializeApp();

function initializeApp() {
  loadPostsFromLocalStorage();
  bindEvents();
  renderPosts();
  updateStats();
}

function loadPostsFromLocalStorage() {
  const savedPosts = localStorage.getItem("posts");
  if (savedPosts) {
    posts = JSON.parse(savedPosts);
  }
}

function savePostsToLocalStorage() {
  localStorage.setItem("posts", JSON.stringify(posts));
}

function bindEvents() {
  document
    .getElementById("post-form")
    .addEventListener("submit", handleFormSubmit);
  document.getElementById("cancel-btn").addEventListener("click", cancelEdit);
  document
    .getElementById("post-image")
    .addEventListener("change", handleImagePreview);
  document
    .getElementById("remove-image")
    .addEventListener("click", removeImagePreview);
  document
    .getElementById("clear-all-btn")
    .addEventListener("click", clearAllPosts);
  document
    .getElementById("search-input")
    .addEventListener("input", searchPosts);
  document
    .getElementById("filter-category")
    .addEventListener("change", applyFilters);
}

function handleFormSubmit(event) {
  event.preventDefault();
  const data = getFormData();

  // validateFormData(data)
  if (!validateFormData(data)) return;

  if (currentEditId) {
    updatePost(currentEditId, data);
  } else {
    addPost(data);
  }
}

function getFormData() {
  let imageData = "";
  const previewContainer = document.getElementById("image-preview");
  if (previewContainer.style.display === "block") {
    const previewImage = document.getElementById("preview-img");
    imageData = previewImage.src;
  }

  const tagsValue = document.getElementById("post-tags").value.trim();
  const tags = tagsValue
    ? tagsValue
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  return {
    title: document.getElementById("post-title").value.trim(),
    author: document.getElementById("post-author").value.trim(),
    category: document.getElementById("category").value,
    content: document.getElementById("post-content").value.trim(),
    tags: tags,
    image: imageData,
  };
}

function validateFormData(data) {
  if (!data.title) {
    alert("Title is required");
    return false;
  }

  if (!data.author) {
    alert("Author is required");
    return false;
  }

  if (!data.category) {
    alert("Category is required");
    return false;
  }

  if (!data.content) {
    alert("Content is required");
    return false;
  }

  return true;
}

function addPost(data) {
  const newPost = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    ...data,
    createdAt: new Date().toISOString(),
  };
  posts.push(newPost);
  showSuccessMessage("Post added successfully!");

  resetForm();
  renderPosts();
  updateStats();
  savePostsToLocalStorage();
}

function updatePost(id, data)
{





    resetForm();
    renderPosts();
    updateStats();
    savePostsToLocalStorage();
}

function renderPosts() {
  const table = document.getElementById("posts-table");
  const tbody = document.getElementById("posts-tbody");
  const emptyState = document.getElementById("empty-state");

  if (posts.length === 0) {
    table.style.display = "none";
    emptyState.style.display = "block";
    return;
  }

  table.style.display = "table";
  emptyState.style.display = "none";

  // [{title: "post1"},{title: "post2"},{title: "post3"}]
  // [<tr></tr>, <tr><tr/>]

  tbody.innerHTML = posts.map((post) => createPostRow(post)).join("");
}

function createPostRow(post) {
  const wordCount = countWords(post.content);
  const excerpt =
    post.content.slice(0, 100) + post.content.length > 100 ? "..." : "";

  const imageHTML = post.image
    ? `<img src="${post.image}" alt="${post.title}" class="cover-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'" /> <div class="no-image" style="display:none'>No Image</div> `
    : `<div class="no-image">No Image</div>`;

  const tagsHTML =
    post.tags.map((tag) => `<span class="tag-badge">${tag}</span>`).join("") ||
    `<span class="tag-badge" style="background:#f1f5f9;color:#64748b;>`;

  return `
    <tr data-post-id="${post.id}">
      <td>${imageHTML}</td>
      <td>${post.title}</td>
      <td>${post.author}</td>
      <td>${post.category}</td>
      <td>${tagsHTML}</td>
      <td class="excerpt">${excerpt}</td>
      <td>${wordCount}</td>
      <td>
        <div class="action-buttons">
          <button class="view-btn" onclick="viewPost('${post.id}')">
            👁 View
          </button>
          <button class="edit-btn" onclick="editPost('${post.id}')">
            ✏️ Edit
          </button>
          <button
            class="delete-btn"
            onclick="deletePost('${post.id}')"
          >
            🗑 Delete
          </button>
        </div>
      </td>
    </tr>
  `;
}

function updateStats() {
  const totalPosts = posts.length;
  const totalWords = posts.reduce(
    (sum, post) => sum + countWords(post.content),
    0
  );
  document.getElementById("total-posts").textContent = `Posts: ${totalPosts}`;
  document.getElementById("total-words").textContent = `Words: ${totalWords}`;
}

function countWords(text) {
  if (!text.trim()) return 0;
  return text.trim().split(/\s+/).length;
}

function editPost(id) {
  const post = posts.find((post) => post.id === id);
  if (!post) return;
  populateForm(post);
  currentEditId = id;
  updateFormMode(true);
}

function populateForm(post) {
  document.getElementById("post-title").value = post.title;
  document.getElementById("post-author").value = post.author;
  document.getElementById("post-category").value = post.category;
  document.getElementById("post-content").value = post.content;
  document.getElementById("post-tags").value = post.tags.join(", ");
  if (post.image) {
    showImagePreview(post.image);
  }
}

function updateFormMode(isEdit) {
  const formTitle = document.getElementById("from-title");
  const submitBtn = document.getElementById("submit-btn");
  const cancelBtn = document.getElementById("cancel-btn");

  if (isEdit) {
    formTitle.textContent = "Edit Post";
    submitBtn.textContent = "Update Post";
    cancelBtn.style.display = "inline-block";
  } else {
    formTitle.textContent = "Add New Post";
    submitBtn.textContent = "Add Post";
    cancelBtn.style.display = "none";
  }
}

function cancelEdit() {
  currentEditId = null;
  resetForm();
  updateFormMode(false);
}

function resetForm() {
  document.getElementById("post-form").reset();
  removeImagePreview();
  currentEditId = null;
  updateFormMode(false);
}

let userName = null;

function veiwPost(id) {
  const post = posts.find((post) => post.id === id);
  if (!post) return;

  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
   <div class="modal">
        <div class="modal-header">
          <h3>${post.title}</h3>
          <button class="close-btn" id="modal-close">✕</button>
        </div>
        <div class="modal-meta">
          <span><strong>Author:</strong> ${post.author}</span>
          <span><strong>Category:</strong> ${post.category}</span>
          <span><strong>Words:</strong> ${countWords(post.content)}</span>
        </div>
       ${post.image ? `<img src="${post.image}" alt="${post.title}" />` : ""}
        <div class="modal-tags">${post.tags
          .map((tag) => `<span class='tag-badge'>${tag}</span>`)
          .join("")}
        </div>
        <div class="modal-content">
          <p>${post.content}</p>
        </div>
        <div class="modal-footer">
          <button class="edit-btn" id="modal-edit">Edit</button>
          <button class="view-btn" id="close-modal">Close</button>
        </div>
      </div>
  `;
  document.body.appendChild(modal);

  document
    .getElementById("close-modal")
    .addEventListener("click", () => modal.remove());
  document
    .getElementById("modal-close")
    .addEventListener("click", () => modal.remove());
  document.getElementById("modal-edit").addEventListener("click", () => {
    modal.remove();
    editPost(id);
  });
}

// xxs
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/* =========================================================
   Notifications
========================================================= */
function showSuccessMessage(message) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.classList.add("show");
  });
  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 300);
  }, 2800);
}

/* =========================================================
   Sample Data (Optional for practice)
========================================================= */
function addSamplePosts() {
  const sample = [
    {
      title: "Getting Started with JavaScript",
      author: "Admin",
      category: "Education",
      content: "JavaScript is a versatile language...",
      tags: ["javascript", "basics"],
      image: "",
    },
    {
      title: "Why Learn Web Development",
      author: "Sarah",
      category: "General",
      content: "Web development opens doors...",
      tags: ["web", "career"],
      image: "",
    },
    {
      title: "Building Better Habits",
      author: "Ali",
      category: "Lifestyle",
      content: "Habits shape our daily lives...",
      tags: ["life", "growth"],
      image: "",
    },
  ];
  sample.forEach((p) =>
    posts.push({
      id: generateId(),
      ...p,
      createdAt: new Date().toISOString(),
    })
  );
  renderPosts();
  updateStats();
  savePostsToStorage();
  showSuccessMessage("Sample posts added!");
}
