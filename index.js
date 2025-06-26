// First, get the elements we’ll work with from the HTML
const factsList = document.getElementById("facts-list");
const loadBtn = document.getElementById("load-btn");

// This function gives a playful explanation for each fact.
// It tries to sound like Mr. Bilal is actually talking to the user.
// We check if certain keywords are in the fact, and respond accordingly.
function getExplanation(fact) {
  const lower = fact.toLowerCase(); // easier to compare

  if (lower.includes("sleep"))
    return "Yes, I nap a lot. It’s not laziness, it’s strategy. Predators like me conserve energy.";
  
  if (lower.includes("groom") || lower.includes("clean"))
    return "Keeping clean isn't just vanity — it's survival. I groom to stay infection-free and fabulous.";
  
  if (lower.includes("meow"))
    return "Fun fact: Meowing is mostly for humans. We barely meow at each other. It’s our way of training you.";
  
  if (lower.includes("purr"))
    return "Purring isn’t just for when I’m happy. I purr when I’m hurt, calm, or manipulating you emotionally.";
  
  if (lower.includes("jump"))
    return "Cats were born for parkour. We don’t just jump — we *float*. Evolution made us elegant.";
  
  if (lower.includes("whisker"))
    return "Whiskers aren’t decoration. They’re sensors. I use them to detect air movement and avoid bad choices.";
  
  if (lower.includes("tail"))
    return "If you don’t know what my tail is saying, you’re missing 90% of the conversation.";

  // If no keywords matched, return a general witty fallback
  const randomLines = [
    "One more reason cats run the world and dogs fetch sticks.",
    "Surprised? That’s just another layer of our mystery.",
    "This is why humans still study us. We're fascinating.",
    "Bet you didn’t see that one coming. Cats, man.",
    "You're doing great. Mr. Bilal is proud."
  ];
  
  return randomLines[Math.floor(Math.random() * randomLines.length)];
}

// Main function that pulls in 5 facts and shows them with Mr. Bilal’s style
function getFacts() {
  // Talk to the Cat Facts API — give me 5 good ones
  fetch("https://catfact.ninja/facts?limit=5")
    .then(response => response.json())
    .then(data => {
      // Clear whatever facts were already there
      factsList.innerHTML = "";

      // Loop through the facts we got back from the server
      for (let i = 0; i < data.data.length; i++) {
        const fact = data.data[i].fact;

        // Make a new list item for each fact
        const li = document.createElement("li");

        // First: The cat fact itself, said in Mr. Bilal’s voice
        const factText = document.createElement("p");
        factText.innerText = `Mr. Bilal says: "${fact}"`;

        // Second: Mr. Bilal explains it in his witty, wise tone
        const explanation = document.createElement("small");
        explanation.innerText = getExplanation(fact);
        explanation.style.display = "block";
        explanation.style.marginTop = "6px";
        explanation.style.color = "#555";
        explanation.style.fontStyle = "italic";

        // Third: Add a new random cat photo (because why not)
        const img = document.createElement("img");
        img.src = "https://cataas.com/cat?width=150&" + new Date().getTime(); // prevent caching
        img.alt = "Mr. Bilal";
        img.style.width = "150px";
        img.style.borderRadius = "8px";
        img.style.marginTop = "12px";

        // Put all the parts into the list item
        li.appendChild(factText);
        li.appendChild(explanation);
        li.appendChild(img);

        // Add this item to the full list on the page
        factsList.appendChild(li);
      }
    })
    .catch(() => {
      // If something goes wrong (no internet, bad API, server down),
      // Mr. Bilal gets upset — but politely lets the user know.
      factsList.innerHTML = `
        <li>
          Mr. Bilal couldn’t reach the internet right now. 
          Maybe check your connection or try again in a bit.
        </li>
      `;
    });
}

// When the user clicks the button, fetch new facts
loadBtn.addEventListener("click", getFacts);

// Load facts as soon as the page is opened
getFacts();
