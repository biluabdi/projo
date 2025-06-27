const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Enable CORS for all origins (allows frontend to communicate with backend)
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// In-memory array to store facts
let facts = [
  { id: 1, fact: "Cats sleep 70% of their lives." },
  { id: 2, fact: "Meowing is mostly for humans." },
];

// GET endpoint to return all facts as JSON
app.get("/api/facts", (req, res) => res.json(facts));

// POST endpoint to add a new fact
app.post("/api/facts", (req, res) => {
  const { fact } = req.body;

  // Validate that 'fact' field is provided
  if (!fact) return res.status(400).json({ error: "Fact is required" });

  // Create new fact object with a unique id based on current timestamp
  const newFact = { id: Date.now(), fact };

  // Add the new fact to the facts array
  facts.push(newFact);

  // Respond with the newly created fact and HTTP 201 Created status
  res.status(201).json(newFact);
});

// PATCH endpoint to update an existing fact by id
app.patch("/api/facts/:id", (req, res) => {
  const id = Number(req.params.id);
  const { fact } = req.body;

  // Find the fact with the given id
  const existingFact = facts.find((f) => f.id === id);

  // If fact not found, respond with 404 Not Found
  if (!existingFact) return res.status(404).json({ error: "Fact not found" });

  // Update the fact text if provided, else keep existing text
  existingFact.fact = fact || existingFact.fact;

  // Respond with the updated fact object
  res.json(existingFact);
});

// DELETE endpoint to remove a fact by id
app.delete("/api/facts/:id", (req, res) => {
  const id = Number(req.params.id);

  // Find index of the fact with the given id
  const index = facts.findIndex((f) => f.id === id);

  // If not found, respond with 404 Not Found
  if (index === -1) return res.status(404).json({ error: "Fact not found" });

  // Remove the fact from the array
  facts.splice(index, 1);

  // Respond with 204 No Content to indicate successful deletion
  res.status(204).send();
});

// Start server and listen on specified port and host
app.listen(PORT, "127.0.0.1", () => {
  console.log(`Backend running at http://127.0.0.1:${PORT}`);
});
