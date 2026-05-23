const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const generatePDF = async () => {
  const browser = await puppeteer.launch();

  const reports = [
    { name: 'Consolidado', htmlPath: path.join(__dirname, 'coverage', 'consolidado.html'), pdfPath: path.join(__dirname, 'coverage', 'coverage-consolidado.pdf') },
    { name: 'Servidor', htmlPath: path.join(__dirname, 'coverage', 'index.html'), pdfPath: path.join(__dirname, 'coverage', 'coverage-server.pdf') },
    { name: 'Cliente', htmlPath: path.join(__dirname, 'coverage', 'client', 'index.html'), pdfPath: path.join(__dirname, 'coverage', 'coverage-client.pdf') }
  ];

  try {
    for (const report of reports) {
      console.log(`Generando PDF ${report.name}...`);
      const page = await browser.newPage();
      await page.goto(`file://${report.htmlPath}`, { waitUntil: 'networkidle0' });
      await page.pdf({
        path: report.pdfPath,
        format: 'A4',
        margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
      });
      console.log(`✓ Reporte ${report.name} PDF: ${report.pdfPath}`);
      await page.close();
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
};

generatePDF();
