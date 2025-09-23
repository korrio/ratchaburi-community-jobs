const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function captureScreenshots() {
  // Create screenshots directory if it doesn't exist
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    locale: 'th-TH'
  });
  const page = await context.newPage();

  try {
    // Base URL - adjust if different
    const baseUrl = 'http://localhost:3000';

    // Helper function to take screenshot
    async function takeScreenshot(url, filename, selector = null) {
      console.log(`Capturing: ${filename}`);
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000); // Wait for animations/loading
      
      if (selector) {
        await page.locator(selector).screenshot({ 
          path: path.join(screenshotsDir, filename),
          type: 'png'
        });
      } else {
        await page.screenshot({ 
          path: path.join(screenshotsDir, filename),
          type: 'png',
          fullPage: true
        });
      }
    }

    // Homepage screenshots
    await takeScreenshot(`${baseUrl}/`, 'web-homepage.png');
    await takeScreenshot(`${baseUrl}/`, 'web-hero-section.png', '.min-h-screen.w-full');

    // Provider pages
    await takeScreenshot(`${baseUrl}/providers`, 'web-providers-list.png');
    await takeScreenshot(`${baseUrl}/providers/register`, 'web-provider-register.png');

    // Customer pages  
    await takeScreenshot(`${baseUrl}/customers`, 'web-customers-list.png');
    await takeScreenshot(`${baseUrl}/customers/register`, 'web-customer-register.png');

    // Matches page
    await takeScreenshot(`${baseUrl}/matches`, 'web-matches-list.png');

    // Admin pages
    await takeScreenshot(`${baseUrl}/admin`, 'web-admin-dashboard.png');
    await takeScreenshot(`${baseUrl}/admin/providers`, 'web-admin-providers.png');
    await takeScreenshot(`${baseUrl}/admin/customers`, 'web-admin-customers.png');
    await takeScreenshot(`${baseUrl}/admin/matches`, 'web-admin-matches.png');

    // Presentation page
    await takeScreenshot(`${baseUrl}/presentation`, 'web-presentation.png');

    console.log('Screenshots captured successfully!');
    
  } catch (error) {
    console.error('Error capturing screenshots:', error);
  } finally {
    await browser.close();
  }
}

// Run the screenshot capture
captureScreenshots().catch(console.error);