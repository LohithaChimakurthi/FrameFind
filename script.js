// FrameFind — Part 2: fetch image results and render them in the grid.

const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const results = document.getElementById("results");
const resultCount = document.getElementById("result-count");
const emptyState = document.getElementById("empty-state");
const quickPickButtons = document.querySelectorAll(".chip");

function render(items) {
  results.innerHTML = "";

  items.forEach((item) => {
    const imageInfo = item.imageinfo && item.imageinfo[0];
    if (!imageInfo || !imageInfo.thumburl) return;

    const card = document.createElement("article");
    card.className = "result-card";

    const imageLink = document.createElement("a");
    imageLink.className = "result-image-link";
    imageLink.href = imageInfo.url || imageInfo.thumburl;
    imageLink.target = "_blank";
    imageLink.rel = "noopener noreferrer";
    imageLink.setAttribute("aria-label", `Open full image: ${item.title}`);

    const image = document.createElement("img");
    image.src = imageInfo.thumburl;
    image.alt = item.title.replace(/^File:/, "").replace(/\.[^.]+$/, "");
    image.loading = "lazy";
    imageLink.appendChild(image);

    const caption = document.createElement("p");
    caption.className = "result-title";
    caption.textContent = item.title.replace(/^File:/, "").replace(/_/g, " ");

    card.appendChild(imageLink);
    card.appendChild(caption);
    results.appendChild(card);
  });

  const renderedCount = results.children.length;
  emptyState.hidden = renderedCount > 0;
  if (renderedCount === 0) {
    emptyState.querySelector("h3").textContent = "No matching images found.";
    emptyState.querySelector("p").textContent = "Try another topic or choose a quick pick.";
  }
  return renderedCount;
}

async function searchImages(query) {
  // Clear the previous search before showing the new results.
  results.innerHTML = "";
  emptyState.hidden = true;
  resultCount.textContent = `Searching for “${query}”…`;

  const url =
    "https://commons.wikimedia.org/w/api.php?action=query&generator=search" +
    "&gsrsearch=" + encodeURIComponent(query) +
    "&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=500&format=json&origin=*";

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Image search failed (HTTP ${response.status}).`);

  const data = await response.json();
  const items = Object.values(data.query?.pages || {});
  const count = render(items);
  resultCount.textContent = `Showing ${count} ${count === 1 ? "result" : "results"} for “${query}”.`;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const query = input.value.trim();
  if (!query) return;

  try {
    await searchImages(query);
  } catch (error) {
    results.innerHTML = "";
    emptyState.hidden = false;
    emptyState.querySelector("h3").textContent = "We couldn’t load those images.";
    emptyState.querySelector("p").textContent = "Please check your connection and try again.";
    resultCount.textContent = error.message;
  }
});

// Quick-pick chips fill the search box and run the same form submission.
quickPickButtons.forEach((button) => {
  button.addEventListener("click", () => {
    input.value = button.textContent.trim();
    form.requestSubmit();
  });
});

// Reset returns the page to its original empty state.
form.addEventListener("reset", () => {
  results.innerHTML = "";
  emptyState.hidden = false;
  emptyState.querySelector("h3").textContent = "Your next favourite image starts with a search.";
  emptyState.querySelector("p").textContent = "Enter a topic above or choose a quick pick to get started.";
  resultCount.textContent = "Your results will appear here";
});
