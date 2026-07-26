# Vijay Prajwal Rajasekar — Portfolio Site

A static, no-build-step portfolio. Just HTML/CSS — open `index.html` in a browser, or host it anywhere static files are served.

## Structure

```
index.html       Home page (hero + category cards + featured project)
school.html       School projects (placeholder cards — ready to fill in)
club.html         Club projects (full carbon fiber motor mount case study)
personal.html      Personal projects (placeholder cards — ready to fill in)
contact.html       Contact info + resume download + message form
assets/style.css   Shared design system (colors, type, layout)
images/            Project photos
```

## How to add a new project

**Quick version (school.html / personal.html):**
Each placeholder `.proj-card` block can become a real project two ways:
1. Quick card — just replace the placeholder text/image with your project's.
2. Full case study — copy the entire `<section class="case-study">` block from `club.html` (the carbon fiber project) into the relevant page, and edit the text/images/spec sidebar. That gives you the same spec-sheet layout, image gallery, and stats grid.

**Images:** drop new photos into `/images/`, then reference them as `images/your-file.png` in the `<img src="...">` tags.

## Things to swap before publishing

- [ ] `your.email@ubc.ca` → your real email (appears in `contact.html`, `index.html`, `school.html`, `club.html`, `personal.html` footers)
- [ ] LinkedIn / GitHub `href="#"` links → your real profile URLs (same files)
- [ ] Resume PDF — upload your resume file somewhere (e.g. into this same folder as `resume.pdf`) and point the "Download Resume" button's `href` at it
- [ ] The contact form currently just shows an alert on submit — wire it to a real service (Formspree, EmailJS, or your own backend) by replacing the `onsubmit` handler in `contact.html`
- [ ] Add real school and personal projects to replace the placeholder cards

## Hosting

Since it's pure static HTML/CSS, you can deploy it for free on:
- **GitHub Pages** — push this folder to a repo, enable Pages in settings
- **Netlify / Vercel** — drag-and-drop the folder onto their dashboard
- **Cloudflare Pages** — same, connect a repo or drag-and-drop

No build step, no dependencies, no `npm install` needed.
