// URL where the backend API lives
const API_BASE = "http://localhost:3000";

// Main UI elements
const factsList = document.getElementById("facts-list");
const factForm = document.getElementById("fact-form");
const factInput = document.getElementById("fact-input");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");

let editFactId = null; // Set when editing, cleared when adding

// Load existing facts from server and inject into list
function renderFacts() {
  factsList.innerHTML = "<li>Loading...</li>";

  fetch(`${API_BASE}/api/facts`)
    .then((res) => res.json())
    .then((facts) => {
      factsList.innerHTML = "";

      if (!facts.length) {
        factsList.innerHTML = '<li class="empty-message">No facts yet.</li>';
        return;
      }

      // Add each fact as a list item with buttons
      facts.forEach(({ id, fact }) => {
        const li = document.createElement("li");
        li.textContent = fact;
        li.dataset.id = id;

        const btnGroup = document.createElement("div");
        btnGroup.classList.add("fact-buttons");

        // "Edit" button setup
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = () => startEditFact(id, fact);

        // "Delete" button setup
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deleteFact(id);

        btnGroup.append(editBtn, deleteBtn);
        li.appendChild(btnGroup);
        factsList.appendChild(li);
      });
    })
    .catch(() => {
      // If fetch fails, inform user
      factsList.innerHTML = "<li style='color:red;'>Error loading data. Is the backend running?</li>";
    });
}

// Form submission: either adds or updates
factForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const factText = factInput.value.trim();
  if (!factText) {
    alert("Please enter a fact.");
    return;
  }

  const isEditing = editFactId !== null;
  const endpoint = isEditing ? `${API_BASE}/api/facts/${editFactId}` : `${API_BASE}/api/facts`;
  const method = isEditing ? "PATCH" : "POST";

  // Send new or updated fact to server
  fetch(endpoint, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fact: factText }),
  })
    .then((res) => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(() => {
      resetForm();
      renderFacts();
    })
    .catch(() => {
      alert(isEditing ? "Could not update fact." : "Could not add fact.");
    });
});

// Switch form into "edit mode"
function startEditFact(id, fact) {
  editFactId = id;
  factInput.value = fact;
  submitBtn.textContent = "Update Fact";
  cancelBtn.classList.remove("hidden");
  factInput.focus();
}

// Cancel editing, return form to normal state
cancelBtn.addEventListener("click", resetForm);

function resetForm() {
  editFactId = null;
  factInput.value = "";
  submitBtn.textContent = "Add Fact";
  cancelBtn.classList.add("hidden");
}

// Ask for confirmation, then delete fact
function deleteFact(id) {
  if (!confirm("Are you sure you want to remove this fact?")) return;

  fetch(`${API_BASE}/api/facts/${id}`, { method: "DELETE" })
    .then((res) => {
      if (res.status === 204) renderFacts();
      else alert("Delete failed.");
    })
    .catch(() => alert("Something went wrong while deleting."));
}

// Load initial facts when page is ready
renderFacts();
