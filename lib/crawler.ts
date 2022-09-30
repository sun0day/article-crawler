import ppt, { Browser, Page } from "puppeteer";

export class Crawler {
  browser!: Browser;
  page!: Page;

  async init() {
    this.browser = await ppt.launch();
    this.page = await this.browser.newPage();
  }

  async run(tasks: ((page: Page) => any)[]) {
    await Promise.all(tasks.map((task) => task(this.page)));
  }
  async close() {
    await this.page.screenshot({ path: "xxxx.png" });
    return this.browser.close();
  }
}
