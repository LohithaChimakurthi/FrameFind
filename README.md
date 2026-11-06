# FrameFind

FrameFind is a visual-discovery app where people can search a topic and browse matching images in a responsive gallery. The warm paper background and deep teal accents create a calm, editorial feel distinct from the PixelPulse reference. Quick-pick topic chips help users get started.

## Features

- Accessible search form and responsive CSS Grid gallery.
- Quick-pick topics and clear-search control.
- Wikimedia Commons image search with URL-encoded multi-word queries.
- Loading spinner shown before the network request starts.
- Friendly empty-results message when no usable images are returned.
- Friendly error message when the request fails or the server returns a non-OK response.
- Result count, lazy-loaded thumbnails, full-image links, and subtle card entrance animation.
- Reduced-motion support for visitors who prefer less animation.

## Run locally

Open `index.html` in a browser and search for a topic such as `cats`, `ocean`, or `new york`. The app uses the public Wikimedia Commons API and does not require an API key.

## Deploy — GitHub Pages

The workflow in `.github/workflows/deploy.yml` publishes this static site to GitHub Pages whenever changes are pushed to `main`. In the repository, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions** if it is not already selected.

- Repository: https://github.com/LohithaChimakurthi/FrameFind
- Live site: https://lohithachimakurthi.github.io/FrameFind/
