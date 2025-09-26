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

function countWords(text) {
  if (!text.trim()) return 0;
  return text.trim().split(/\s+/).length;
}

function veiwPost(id)
{
  
}

function editPost(id)
{
  currentEditId = id
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
