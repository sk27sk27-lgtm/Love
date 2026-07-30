# Our Constellation 🌌

A small romantic site: night sky background, floating hearts, twinkling stars,
6 flip-cards of your photos with love notes, and a soft generative instrumental
that plays right in the browser (no external audio file needed, so nothing to
break or get copyright-flagged).

## Files
```
index.html   → the page
style.css    → all styling / animations
script.js    → gallery, canvas stars, hearts, music
images/      → your 6 photos (already resized for the web)
```

## How to put this on GitHub Pages

1. Create a new repository on GitHub (e.g. `our-constellation`).
2. Upload **all the files in this zip** (index.html, style.css, script.js,
   and the images folder) to the repo — keep the folder structure exactly
   as it is.
3. Go to the repo's **Settings → Pages**.
4. Under "Build and deployment", set **Source: Deploy from a branch**,
   branch: `main`, folder: `/ (root)`. Save.
5. Wait a minute, then your site will be live at:
   `https://<your-username>.github.io/<repo-name>/`

## Personalizing it

- Open `script.js` and edit the `PHOTOS` array at the top — change the
  `caption` and `message` text under each photo to whatever you'd like.
- Open `index.html` and edit the text inside `.hero-title`, `.hero-sub`,
  and the `.closing` section for your own headline/closing message.
- Click the "Play our song" button in the top right to start the ambient
  music (browsers require a click before audio can play).

Enjoy! 💛
