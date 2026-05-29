#!/usr/bin/env node
/**
 * Screenshot audit script — cattura pagine per audit visivo
 * Usa Chrome/Chromium per rendere il sito e salvare i screenshot
 */

const fs = require('fs');
const path = require('path');

(async () => {
  try {
    // Prova con puppeteer prima
    const puppeteer = await import('puppeteer').catch(() => null);

    if (!puppeteer) {
      console.log('❌ Puppeteer non installato. Uscita.');
      console.log('Per screenshot: npm install --save-dev puppeteer');
      process.exit(0);
    }

    const browser = await puppeteer.default.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const screenshotsDir = './public/screenshots-audit';
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    const viewports = [
      { name: 'mobile', width: 375, height: 812 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1440, height: 900 }
    ];

    for (const viewport of viewports) {
      const page = await browser.newPage();
      await page.setViewport(viewport);
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

      const filename = path.join(screenshotsDir, `homepage-${viewport.name}.png`);
      await page.screenshot({ path: filename, fullPage: true });
      console.log(`✅ Saved: ${filename}`);

      await page.close();
    }

    await browser.close();
    console.log('\n✅ Screenshot audit completato!');
  } catch (err) {
    console.error('Errore:', err.message);
  }
})();
