# Fit India Troop — Premium Website

A cinematic, immersive single-page site for **Fit India Troop** (Tumakuru) — gym, CrossFit & recovery. Built with vanilla JS, custom CSS design system, Three.js (scroll-driven lat-pulldown hero), GSAP ScrollTrigger + Lenis smooth scroll — all progressively enhanced (the site works even if a library fails to load).

## Run it
No build step. Serve the folder with any static server:

```bash
# Python (built in)
python3 -m http.server 5173
# then open http://localhost:5173
```

Or drag this folder onto Netlify / Vercel / Cloudflare Pages to deploy.

## ✏️ Edit everything from ONE file
Open **`js/config.js`** — prices, phone numbers, WhatsApp, email, address, Google Map,
business hours, social links, programs, plans, trainers, testimonials, gallery list and
FAQ all live there. No other file needs touching for content changes.

## 🖼️ Add your photos
Drop image files into **`assets/images/`** using these exact names (they'll appear instantly).
Until then, tasteful placeholders are shown.

| Slot | Filenames |
|------|-----------|
| Gallery (masonry + lightbox) | `gym-1.jpg` … `gym-8.jpg` |
| About section | `about-1.jpg`, `about-2.jpg` |
| Trainers | `trainer-1.jpg` … `trainer-4.jpg` |
| Success stories | `member-1.jpg`, `member-2.jpg`, `member-3.jpg` |

- The **Fitness / CrossFit / Recovery** section visuals reuse `gym-1/2/3.jpg`.
- Add or remove gallery items freely by editing the `gallery` array in `config.js`.
- Any name works — just match the filename in `config.js` to the file you drop in.

## 🎨 Brand
Matte black base with the **India tricolor** (saffron `#FF9933` + green `#138808`) as accents,
matching the real Fit India Troop logo. The logo is a clean SVG at `assets/logo.svg`
(swap it for an official file if you have one).

## Google Map
In `config.js → contact.mapEmbed`, paste the embed URL from Google Maps
(*Share → Embed a map → copy the `src`*) for your exact location.
