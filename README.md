# Stillroom — AI Photo Enhancement Studio (starter)

A privacy-first, static photo editing web app. The app runs in the browser and does not upload your photos to a server.

## Features
- Multi-image session and thumbnail filmstrip
- Side-by-side wipe comparison of original vs edited
- Gentle image-based auto-adjustment suggestions
- Exposure, contrast, highlights, shadows, warmth, saturation, and sharpening controls
- High-quality browser resampling at 1×, 1.5×, 2×, or 3× output\n- Optional Replicate SwinIR AI denoising and 2× AI super-resolution through protected Vercel serverless endpoints
- Export edited JPEG copies
- Save copies in IndexedDB (browser/device-local storage)
- Responsive desktop and mobile layout

## Important limitations
- Auto adjustments are a heuristic starting point, not a trained AI image model.
- Browser upscaling uses canvas resampling. Optional AI upscale and denoise run on Replicate cloud infrastructure, not on your computer, and may incur charges.
- Object/person removal is not implemented yet. It requires a mask-based inpainting workflow and review before saving.
- Browser storage can be cleared by browser settings and is not a backup. Download important edits to your computer.
- Google Fonts is loaded from an external CDN for typography. Photo processing itself is local.

## Run locally
Simply open `index.html` in a modern browser, or serve the folder with a local static server. For example, from this folder:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Enable AI features with Vercel\n1. Import this repository into Vercel and deploy it as a project. The `api/` folder is deployed as serverless functions.\n2. In Vercel → Project → Settings → Environment Variables, add `REPLICATE_API_TOKEN` for Production (and Preview if needed). Never put the token in `app.js` or commit it to GitHub.\n3. Redeploy after adding the variable. Open the Vercel deployment URL, not the GitHub Pages URL: GitHub Pages is static and cannot run `/api/replicate-denoise` or `/api/replicate-status`.\n4. AI tools send an image copy to Replicate for cloud processing. Manual adjustments and browser library storage remain local. The AI endpoint accepts images up to approximately 4 MB.\n\n## Publish with GitHub Pages
1. Create a new repository named `ai-photo-enhancement-studio` on GitHub. Keep it separate from other projects.
2. Upload `index.html`, `styles.css`, `app.js`, and `README.md` to the repository root.
3. In **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, and save.
4. Wait for the Pages deployment. The published URL will be shown under **Settings → Pages**.

No API keys or secrets are required for this starter. Do not add personal photos to the public repository.


## AI grain and noise removal (Replicate)
This feature uses the SwinIR image-restoration model for color-image denoising. It requires a server runtime; GitHub Pages alone cannot run the private-token proxy.
1. Import this repository into Vercel (or deploy the same repository as a Vercel project).
2. In Vercel → Project Settings → Environment Variables, add `REPLICATE_API_TOKEN` with a token from [Replicate account settings](https://replicate.com/account/api-tokens). Never put the token in `app.js` or any public file.
3. Redeploy the Vercel project. The UI's AI denoise button calls `/api/replicate-denoise`.
4. Keep the GitHub Pages site for the static preview if desired; the AI button requires the Vercel deployment URL because Pages cannot run serverless functions. For production, configure the frontend to use the Vercel deployment domain or use a custom domain.

The model is an AI restoration tool, not a guarantee of perfectly faithful reconstruction. Always compare output against the original, especially faces and fine details. Replicate usage may be billed per run. The current endpoint limits inline image payloads to approximately 4 MB.
