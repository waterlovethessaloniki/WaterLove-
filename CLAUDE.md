# Water Love — Project Rules

## About
Static multi-page website for "Water Love", an aquarium store in Thessaloniki (owner: Λαμπρινή Μπιζίκη). Hosted on GitHub Pages, served from the repo root. Greek-language site.

## Architecture
- Separate HTML pages: index.html, about.html, products.html, faq.html, contact.html
- Shared styles.css and app.js across all pages
- admin.html: management panel (gallery + products) using Cloudinary + a Cloudflare Worker + GitHub JSON files
- gallery-data.json and products-data.json are the live "databases" — DO NOT edit these manually, they are written by the Worker
- worker.js is reference code for the Cloudflare Worker

## Mandatory Git workflow
After completing ANY change to the website files, you MUST automatically:
1. Run: git add -A
2. Run: git commit with a short, clear message in English describing the change
3. Run: git push origin main
Do this without being asked. Always push so the live site updates.

## Commit message rules — IMPORTANT
- Commit messages must contain ONLY the description of the change
- NEVER add "Generated with Claude Code", any Claude/Anthropic signature, any co-author line, or any emoji/branding to commit messages
- Do not add a Co-Authored-By trailer
- Keep messages plain and human, as if written by the repo owner

## Hard rules
- Never edit gallery-data.json or products-data.json by hand
- Keep all user-facing text in Greek
- Do not use em-dashes (—) anywhere in site text; use commas or middle dots (·) instead
- Preserve the existing design system (colors, fonts, spacing) unless explicitly asked to change it
- Mobile experience is top priority: test that changes work on narrow screens
- Never expose or hardcode secrets/tokens in any committed file
