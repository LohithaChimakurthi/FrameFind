# FrameFind

FrameFind is a visual-discovery app where people can search a topic and browse matching images in a responsive gallery. The warm paper background and deep teal accents create a calm, editorial feel distinct from the PixelPulse reference. The large, question-led hero makes the next action obvious, while quick-pick topic chips and a friendly empty state help users get started.

## Part 1 — Scaffold and UI

- Semantic HTML structure and accessible search form.
- Responsive CSS Grid gallery.
- Quick-pick topic chips and a clear-search control.

## Part 2 — Fetch and render

- Listens for the search form's `submit` event and prevents the browser's default page reload.
- Ignores blank queries and safely encodes multi-word searches with `encodeURIComponent`.
- Fetches image files from the Wikimedia Commons API, checks `response.ok`, and parses the JSON response.
- Builds a card for each result with `document.createElement` and `appendChild`, clearing the previous results first.
- Shows a result count, lets users open the full image in a new tab, and wires the quick-pick chips to run searches.

## Run locally

Open `index.html` in a browser. Search for a topic such as `cats`, `ocean`, or `new york`. The app uses the public Wikimedia Commons API and does not require an API key.
