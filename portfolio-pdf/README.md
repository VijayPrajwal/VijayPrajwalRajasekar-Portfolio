# Portfolio PDF Generator

This directory contains the tools to generate the downloadable recruiter-focused PDF portfolio without having to maintain a separate codebase.

## Requirements
- Node.js (v18+)

## Setup
Run the following command to install dependencies:
```bash
npm install
```

## How to Regenerate the PDF
Whenever you change the content in `data.json`, you must regenerate the PDF.
```bash
npm run generate
```
This will run `generate.js`, compile the Handlebars template, and output the new PDF to `../assets/Vijay_Prajwal_Rajasekar_Portfolio.pdf`.

## How to Add a New Project
1. Open `data.json`.
2. Add a new object to the `projects` array.
3. Fill in the fields: `title`, `role`, `overview`, `objective`, `approach`, `outcome`, `tools`, and `images`.
4. To add images, ensure they are in the `images/` directory at the root of the repository, and reference them in the JSON using relative paths (e.g., `"../images/your-image.jpg"`).
5. Run `npm run generate` to rebuild the PDF.

## How it Works
1. **data.json**: The single source of truth for the PDF content. This keeps text condensed for recruiters without cluttering the HTML files.
2. **template.hbs**: The HTML skeleton for the PDF.
3. **print.css**: The stylesheet that styles the PDF (light theme, print-optimized).
4. **generate.js**: Uses Handlebars to inject the JSON into the template, then uses Puppeteer (headless Chrome) to "print" the resulting webpage to a PDF file.

## Limitations
- Do not use interactive elements (like 3D viewers or videos) in `data.json` as they will not render in the static PDF. Use static fallback images instead.
- If images do not load, verify that the relative paths in `data.json` are correct (`../images/...`).
