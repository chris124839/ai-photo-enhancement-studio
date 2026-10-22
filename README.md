# Stillroom — AI Photo Enhancement Studio (starter)

A privacy-first, static photo editing web app. The app runs in the browser and does not upload your photos to a server.

## Features in this starter
- Multi-image session and thumbnail filmstrip
- Side-by-side wipe comparison of original vs edited
- Gentle image-based auto-adjustment suggestions
- Exposure, contrast, highlights, shadows, warmth, saturation, and sharpening controls
- High-quality browser resampling at 1×, 1.5×, 2×, or 3× output
- Export edited JPEG copies
- Save copies in IndexedDB (browser/device-local storage)
- Responsive desktop and mobile layout

## Important limitations
- Auto adjustments are a heuristic starting point, not a trained AI image model.
- Upscaling uses browser canvas resampling. It is not AI super-resolution and cannot reconstruct authentic detail absent from the original. For genuine AI upscaling, export the image and process it with a trusted local tool such as [Upscayl](https://github.com/upscayl/upscayl) or [Real-ESRGAN](https://github.com/xinntao/Real-ESRGAN).
- Removing people from photos is not yet implemented. Reliable object removal needs an inpainting model or a manual mask/clone workflow; it should be added as a separate feature and reviewed before saving so backgrounds and faces are not inadvertently changed.
- Browser storage can be cleared by browser settings and is not a backup. Download important edits to your computer.
- Google Fonts is loaded from an external CDN for typography. Photo processing itself is local.

## Run locally
Simply open `index.html` in a modern browser, or serve the folder with a local static server. For example, from this folder:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish with GitHub Pages
1. Create a new repository named `ai-photo-enhancement-studio` on GitHub. Keep it separate from other projects.
2. Upload `index.html`, `styles.css`, `app.js`, and `README.md` to the repository root.
3. In **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, and save.
4. Wait for the Pages deployment. The published URL will be shown under **Settings → Pages**.

No API keys or secrets are required for this starter. Do not add personal photos to the public repository.
