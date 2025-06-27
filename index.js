// Base URL of the backend API server
const API_BASE = "http://127.0.0.1:3000"; // Use 127.0.0.1 instead of localhost to avoid CORS issues

// Grab references to DOM elements we will work with
const factsList = document.getElementById("facts-list");
const factForm = document.getElementById("fact-form");
const factInput = document.getElementById("fact-input");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");

let editFactId = null; // Tracks if we are editing an existing fact (stores its id), or adding a new one

// Fetch facts from backend and display them in the UI
function renderFacts() {
  factsList.innerHTML = "<li>Loading...</li>"; // Show loading message while fetching

  fetch(`${API_BASE}/api/facts`) // Request all facts from backend
    .then((res) => res.json())  // Parse JSON response
    .then((data) => {
      factsList.innerHTML = ""; // Clear loading message

      // If no facts yet, show friendly message
      if (!data.length) {
        factsList.innerHTML = '<li class="empty-message">No facts yet. Add one!</li>';
        return;
      }

      // For each fact, create a list item with text and buttons
      data.forEach(({ id, fact }) => {
        const li = document.createElement("li");
        li.textContent = fact;         // Show the fact text
        li.dataset.id = id;            // Store fact id for reference

        const btns = document.createElement("div");
        btns.classList.add("fact-buttons");

        // Edit button to start editing this fact
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = () => startEditFact(id, fact);

        // Delete button to remove this fact
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deleteFact(id);

        btns.append(editBtn, deleteBtn); // Add buttons to button container
        li.appendChild(btns);            // Add buttons to list item
        factsList.appendChild(li);       // Add list item to facts list
      });
    })
    .catch(() => {
      // If fetching facts fails (backend down or network error), show error message
      factsList.innerHTML = "<li style='color:red;'>⚠️ Cannot load facts — check if backend is running.</li>";
    });
}

// Handle form submission (add new fact or update existing fact)
factForm.addEventListener("submit", (e) => {
  e.preventDefault();               // Prevent default page reload on form submit
  const factText = factInput.value.trim();  // Get and trim user input

  if (!factText) return alert("Please enter a fact."); // If input empty, alert user

  if (editFactId) {
    // If we are editing an existing fact, send PATCH request to update it
    fetch(`${API_BASE}/api/facts/${editFactId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fact: factText }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Update failed");
        return res.json();
      })
      .then(() => {
        resetForm();   // Reset form state to "add new fact"
        renderFacts(); // Reload facts to show updated data
      })
      .catch(() => alert("Failed to update fact."));
  } else {
    // If adding a new fact, send POST request to backend
    fetch(`${API_BASE}/api/facts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fact: factText }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Add failed");
        return res.json();
      })
      .then(() => {
        resetForm();   // Clear input field and reset form
        renderFacts(); // Reload list with new fact added
      })
      .catch(() => alert("Failed to add fact."));
  }
});

// Prepare the form for editing a fact: fill input, change buttons
function startEditFact(id, fact) {
  editFactId = id;           // Store id of fact being edited
  factInput.value = fact;    // Put fact text in input field
  submitBtn.textContent = "Update Fact";  // Change submit button text
  cancelBtn.classList.remove("hidden");   // Show cancel button
  factInput.focus();         // Focus input so user can type right away
}

// Cancel editing and reset form to initial "add" state
cancelBtn.addEventListener("click", resetForm);

function resetForm() {
  editFactId = null;          // Clear edit state
  factInput.value = "";       // Clear input
  submitBtn.textContent = "Add Fact";  // Reset submit button text
  cancelBtn.classList.add("hidden");   // Hide cancel button
}

// Delete a fact after confirming with the user
function deleteFact(id) {
  if (!confirm("Delete this fact?")) return;  // Confirm before deleting

  fetch(`${API_BASE}/api/facts/${id}`, { method: "DELETE" })
    .then((res) => {
      if (res.status === 204) renderFacts(); // Refresh list after delete
      else alert("Delete failed");
    })
    .catch(() => alert("Error deleting fact."));
}

// Load facts immediately when page loads
renderFacts();
