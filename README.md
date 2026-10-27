# FRAME / CUT — Static Video Editor Portfolio

A single-page, responsive portfolio built with plain HTML, CSS and JavaScript. All sections (Home, Work, Services, About, Contact) are on one page. Reel/project data and Indian pricing are editable in `script.js`.

## Run locally
1. Extract the ZIP.
2. Open the folder in VS Code.
3. Use the Live Server extension and open `index.html`. You can also open `index.html` directly in a browser.

## Edit your own reels
Open `script.js` and edit the `PROJECTS` array near the top. Each project looks like:

```js
{
  title: "My Instagram Reel",
  type: "Instagram Reel",
  category: "reels", // reels | ads | brand
  year: "2026",
  poster: "assets/images/my-reel-poster.jpg",
  video: "assets/videos/my-reel.mp4"
}
```

Put the actual MP4 in `assets/videos/` and its thumbnail/poster image in `assets/images/`. Keep the path and filename exactly the same as the values in `script.js`. The first four projects automatically appear in the hero reel strip. All projects appear in Work, with category filters.

If you don't have a poster yet, the poster image will hide itself if missing; add poster images for the best result. Use optimized web-ready MP4/H.264 videos. The video preview opens in a modal with native controls.

## Change pricing
Edit the `PRICING` array in `script.js`. Example starting Indian rates are included:
- Reel Edit: ₹1,499 per reel
- Creator Pack: ₹5,999 per 5 reels
- Promo Film: ₹7,999 per project

These are sample estimates only. Replace them with your client's real rates and package terms.

## Change branding and contact links
At the top of `script.js`, edit:
- `SITE_CONFIG.email`
- `SITE_CONFIG.instagram`
- `SITE_CONFIG.whatsapp` (country code + number, digits only)

Also search `index.html` for `FRAME / CUT`, and replace the name with the editor's actual brand.

## Notes
- This is a static site; no build step or npm packages are required.
- Contact links open email/Instagram/WhatsApp. There is no backend contact form.
- If video files are missing, clicking a preview may show a media error until you add the corresponding real video.
- For production, compress videos and use poster thumbnails so the page stays fast on mobile.
