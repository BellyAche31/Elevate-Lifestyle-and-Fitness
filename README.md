# Elevate Lifestyle and Fitness — Website

Static marketing site for **Elevate Lifestyle and Fitness** — 143 Susano Rd, Novaliches,
Quezon City, 1117 Metro Manila.

**Live:** https://elevate-lifestyle-jcg1312003-3056s-projects.vercel.app/
(Vercel project `elevate-lifestyle`)

No build step, no dependencies. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Structure

```
index.html          all page content and markup
css/styles.css      brand palette + all styling
js/main.js          schedule data, gallery, form, interactions
assets/logo.svg     logo mark (vector recreation — see "Swapping in the real logo")
assets/favicon.svg  browser tab icon
assets/gallery/     drop photos here (see "Adding photos")
robots.txt, sitemap.xml
```

## Common edits

| What | Where |
|---|---|
| Group class schedule | `js/main.js` → `CLASSES` |
| Pilates slots | `js/main.js` → `PILATES` |
| Gallery photos & captions | `js/main.js` → `GALLERY` |
| Membership prices | `index.html` → search for `data-editable` |
| Email address | `js/main.js` → `CONTACT_EMAIL`, plus the `mailto:` links in `index.html` |
| Facebook / Instagram | `index.html` → footer `.socials` (currently `href="#"` placeholders) |
| Brand colours | `css/styles.css` → `:root` |

### Membership prices

Each plan card shows `₱ Ask` as a placeholder. Replace the text inside
`<span class="amt" data-editable>Ask</span>` with the real figure, e.g. `1,499`.

### Adding photos

Save images into `assets/gallery/` with these exact filenames and they appear
automatically — no code change needed. Any that are missing fall back to a
branded placeholder tile, so the grid never looks broken.

```
community.jpg   gym-floor.jpg   classes.jpg
pilates.jpg     court.jpg       billiards.jpg
```

Recommended: JPG or WebP, roughly 1600×1200, under 400 KB each.

### Swapping in the real logo

`assets/logo.svg` is a vector recreation of the club logo. To use the original
artwork instead, save it as `assets/logo.png` and update the two `<img src>`
references in `index.html` (header and footer). A transparent PNG at
about 600 px wide works well.

### Contact form

The form validates in the browser and then opens the visitor's email app with
the message pre-filled to `elevatelifestyle2025@gmail.com`. No third-party
service is involved and nothing is stored.

To have submissions arrive as email without the visitor's mail app opening,
sign up for a form service (Formspree, FormSubmit, Web3Forms) and replace the
`window.location.href = "mailto:..."` block in `js/main.js` with a `fetch()`
POST to their endpoint.

## Deploying

The site is plain static files, so any host works:

- **Vercel** — `vercel --prod` from this folder. To get automatic deploys on
  every push, install the Vercel GitHub app
  (<https://github.com/apps/vercel>) and link this repository to the
  `elevate-lifestyle` project; the current live copy was uploaded directly,
  so pushes do not redeploy it yet.
- **GitHub Pages** — Settings → Pages → deploy from this branch, root folder.
- **Netlify / Cloudflare Pages** — drag and drop the folder.

## Accessibility & SEO notes

- Skip link, visible focus rings, labelled form fields with inline errors.
- `prefers-reduced-motion` is respected — animations switch off.
- `LocalBusiness` structured data, Open Graph tags, sitemap and robots.txt included.
- Update the `canonical`, `og:image`, sitemap and robots URLs once a custom
  domain is connected.
