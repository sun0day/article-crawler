import { Page } from "puppeteer";
import { Article, ArticleSource, Lang } from "../../types";
// html.replace(/((class|style)="[^"]+")|/g, "");

export const jwCrawler = async (page: Page) => {
  await page.goto("https://javascriptweekly.com/latest");
  const articles = await Promise.all([
    page.$$eval(".el-item", (els) => {
      return els.map((el) => {
        const titleNode = el.querySelector(".mainlink a");
        const authorNode = el.querySelector(".name");
        const descNode = el.querySelector(".desc");
        return {
          title: titleNode.text,
          link: titleNode.href,
          author: authorNode.innerHTML.replace(/<.+$/, "").trim(" "),
          desc: descNode.innerHTML
            .replace(/((class|style)="[^"]+")|/g, "")
            .replace(/<span.+<\/span>/, "")
            .replace(/^.+—\s*/, ""),
        } as Article;
      });
    }),
    page.$$eval(".el-item:not(.jobs) + .miniitem", (els) => {
      return els.map((el) => {
        const titleNode = el.querySelector(".desc a");
        const authorNode = el.querySelector(".name");
        return {
          title: titleNode.text,
          link: titleNode.href,
          author: authorNode.textContent,
        } as Article;
      });
    }),
    page.$$eval(".content p", (els) => {
      return els
        .map((el) => el.innerHTML)
        .filter((html) => html.indexOf("</a>") > -1)
        .map(
          (html) =>
            ({
              html: html
                .replace(/((class|style)="[^"]+")|/g, "")
                .replace(/<br>\n↳/g, " – "),
              tags: ["misc"],
            } as Article)
        );
    }),
  ]);

  return articles
    .reduce((acc, item) => acc.concat(item), [] as Article[])
    .map((article) => ({
      ...article,
      lang: Lang.Javascript,
      tags: [ArticleSource.JavascriptWeekly, ...(article.tags || [])],
    }));
};
