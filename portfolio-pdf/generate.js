const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const QRCode = require('qrcode');

async function generatePDF() {
  console.log('Generating QR Code...');
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'));
  
  // Generate QR code for the portfolio URL
  data.qrCode = await QRCode.toDataURL(data.profile.portfolioUrl, { errorCorrectionLevel: 'H' });
  
  // Fix image paths to be base64 data URIs
  if (data.projects) {
    data.projects.forEach(p => {
      if (p.images) {
        p.images = p.images.map(img => {
          const imgPath = path.resolve(__dirname, img);
          if (fs.existsSync(imgPath)) {
            let ext = path.extname(imgPath).slice(1).toLowerCase();
            if (ext === 'jpg') ext = 'jpeg';
            const base64 = fs.readFileSync(imgPath).toString('base64');
            return `data:image/${ext};base64,${base64}`;
          }
          return img;
        });
      }
    });
  }

  console.log('Compiling Handlebars template...');
  const templateSource = fs.readFileSync(path.join(__dirname, 'template.hbs'), 'utf8');
  const printCss = fs.readFileSync(path.join(__dirname, 'print.css'), 'utf8');
  
  // Inject CSS directly into the template source to avoid external file loading
  const modifiedTemplateSource = templateSource.replace(
    /<link\s+rel="stylesheet"\s+href="print\.css"\s*\/?>/i,
    `<style>${printCss}</style>`
  );
  
  const template = handlebars.compile(modifiedTemplateSource);
  const html = template(data);

  console.log('Launching Puppeteer to generate PDF...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Write to temp file to avoid large string IPC hangs
  const tempHtmlPath = path.join(__dirname, 'temp.html');
  fs.writeFileSync(tempHtmlPath, html);
  
  // Set content via goto
  const fileUrl = require('url').pathToFileURL(tempHtmlPath).href;
  await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
  
  // Define output path for the PDF
  const outputDir = path.join(__dirname, '..', 'assets');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const outputPath = path.join(outputDir, 'Vijay_Prajwal_Rajasekar_Portfolio.pdf');
  
  await page.pdf({
    path: outputPath,
    format: 'Letter',
    printBackground: true
  });

  await browser.close();

  console.log(`PDF generated successfully at: ${outputPath}`);
}

generatePDF().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
