const { Builder, Browser } = require("selenium-webdriver");

class BrowserService {
  constructor() {
    this.driver = null;
  }

  async init() {
    this.driver = await new Builder().forBrowser(Browser.CHROME).build();
    return this.driver;
  }

  async navigateTo(url) {
    if (!this.driver) throw new Error("Driver not initialized");
    console.log(`\nLaunching WebDriver for: ${url}...`);
    await this.driver.get(url);
  }

  async extractDOMAndScreenshot() {
    if (!this.driver) throw new Error("Driver not initialized");
    
    console.log("-> [Extraction] Expanding dropdowns and collapsed elements...");
    await this.driver.executeScript(`
        try {
            document.querySelectorAll('[data-bs-toggle="dropdown"], [data-toggle="dropdown"], .dropdown-toggle').forEach(el => el.click());
            document.querySelectorAll('[data-bs-toggle="collapse"], [data-toggle="collapse"], .accordion-button').forEach(el => {
                if(el.getAttribute('aria-expanded') === 'false') el.click();
            });
            document.querySelectorAll('details:not([open])').forEach(el => el.setAttribute('open', 'true'));
        } catch (e) { console.error(e); }
    `);
    await new Promise((r) => setTimeout(r, 2000));

    console.log("-> [Extraction] Cleaning DOM...");
    let cleanHtml = "";
    try {
      cleanHtml = await this.driver.executeScript(`
            const clone = document.body.cloneNode(true);
            const elementsToRemove = clone.querySelectorAll('script, style, noscript, svg');
            elementsToRemove.forEach(el => el.remove());
            return clone.innerHTML;
        `);
    } catch (e) {
      console.log("Error cleaning DOM:", e.message);
    }

    console.log("-> [Extraction] Taking full-page screenshot...");
    let encodedString = "";
    try {
      const metrics = await this.driver.sendAndGetDevToolsCommand('Page.getLayoutMetrics');
      const width = Math.ceil(metrics.contentSize ? metrics.contentSize.width : metrics.cssContentSize.width);
      const height = Math.ceil(metrics.contentSize ? metrics.contentSize.height : metrics.cssContentSize.height);
      
      const res = await this.driver.sendAndGetDevToolsCommand('Page.captureScreenshot', {
          clip: { x: 0, y: 0, width, height, scale: 1 },
          captureBeyondViewport: true
      });
      encodedString = res.data;
    } catch (cdpErr) {
      try {
        const width = await this.driver.executeScript("return Math.max(document.body.scrollWidth, document.body.offsetWidth, document.documentElement.clientWidth, document.documentElement.scrollWidth, document.documentElement.offsetWidth);");
        const height = await this.driver.executeScript("return Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);");
        await this.driver.manage().window().setRect({ width: width, height: height });
        encodedString = await this.driver.takeScreenshot();
      } catch (resizeErr) {
        encodedString = await this.driver.takeScreenshot();
      }
    }

    return { cleanHtml, encodedString };
  }

  async quit() {
    if (this.driver) {
      await this.driver.quit();
      this.driver = null;
    }
  }
}

module.exports = new BrowserService();
