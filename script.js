// FrameFind — Part 3: loading, empty, and error states.

const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const results = document.getElementById("results");
const resultCount = document.getElementById("result-count");
const emptyState = document.getElementById("empty-state");
const loadingState = document.getElementById("loading-state");
const quickPickButtons = document.querySelectorAll(".chip");
let activeSearch = 0;

function showEmptyState(title, message) {
  emptyState.querySelector("h3").textContent = title;
  emptyState.querySelector("p").textContent = message;
  emptyState.hidden = false;
}

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

  return results.children.length;
}

async function searchImages(query) {
  const searchId = ++activeSearch;
  results.innerHTML = "";
  emptyState.hidden = true;
  loadingState.hidden = false;
  results.setAttribute("aria-busy", "true");
  resultCount.textContent = `Searching for “${query}”…`;

  const url =
    "https://commons.wikimedia.org/w/api.php?action=query&generator=search" +
    "&gsrsearch=" + encodeURIComponent(query) +
    "&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=500&format=json&origin=*";

  try {
    // The loading indicator is visible before this request begins.
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    // Ignore an older response if the user has already started another search.
    if (searchId !== activeSearch) return;

    const items = Object.values(data.query?.pages || {});
    const count = render(items);

    if (count === 0) {
      showEmptyState(
        "No images found for that search.",
        "Try another word, or choose one of the quick picks above."
      );
      resultCount.textContent = `No results for “${query}”.`;
    } else {
      emptyState.hidden = true;
      resultCount.textContent = `Showing ${count} ${count === 1 ? "result" : "results"} for “${query}”.`;
    }
  } catch (error) {
    if (searchId !== activeSearch) return;
    results.innerHTML = "";
    showEmptyState(
      "Something went wrong.",
      "We couldn’t load the images. Check your connection and please try again."
    );
    resultCount.textContent = "Image search is temporarily unavailable.";
  } finally {
    if (searchId === activeSearch) {
      loadingState.hidden = true;
      results.setAttribute("aria-busy", "false");
    }
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = input.value.trim();
  if (!query) {
    input.focus();
    return;
  }
  searchImages(query);
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
  activeSearch += 1;
  results.innerHTML = "";
  loadingState.hidden = true;
  results.setAttribute("aria-busy", "false");
  showEmptyState(
    "Your next favourite image starts with a search.",
    "Enter a topic above or choose a quick pick to get started."
  );
  resultCount.textContent = "Your results will appear here";
});
