# Gallery photos

Upload photos into **this folder** and they appear on the site automatically —
no code change needed. GitHub Pages redeploys about a minute after each upload.

## Filenames

Use these six base names. The extension does not matter (`.jpg`, `.jpeg`,
`.png`, `.webp` and `.avif` all work), but the name before the dot must match
exactly — all lowercase, hyphens not spaces:

| File | Where it appears |
|---|---|
| `community` | Large tile, top left — the FTMG team photo |
| `gym-floor` | Small tile |
| `classes` | Small tile |
| `pilates` | Small tile |
| `court` | Small tile |
| `billiards` | Wide tile, bottom |

So `community.jpg`, `gym-floor.png`, `court.webp` are all fine.
`Community.JPG` works too. `gym floor.jpg` or `gymfloor.jpg` will not.

Any name you skip keeps its branded placeholder tile, so a partly-filled
gallery still looks intentional rather than broken.

## Recommended sizes

- `community` and `billiards` are wide tiles — landscape photos suit them best.
- Roughly 1600×1200 is plenty. Anything much larger just slows the page down.
- Keep each file under about 400 KB where you can.
- **HEIC will not work** — iPhones shoot HEIC by default and browsers cannot
  display it. On iPhone: Settings → Camera → Formats → **Most Compatible** to
  shoot JPEG, or share the photo to Files first, which converts it.

## Changing the captions

The caption drawn over each photo lives in `js/main.js`, in the `GALLERY`
block near the top. Edit the `caption` text there.
