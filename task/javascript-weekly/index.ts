import { Page } from "puppeteer";
import { Article, ArticleSource } from "../../types";
export const jwTask = async (page: Page) => {
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
            .replace(/<[^>]+>/g, "")
            .replace(/^.+(-|—)\s*/, ""),
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
              html: html.replace(
                /((class|style)="[^"]+")|(\<br\>)|(\n)|(↳ )/g,
                ""
              ),
              tags: ["others"],
            } as Article)
        );
    }),
  ]);
  console.log(
    articles
      .reduce((acc, item) => acc.concat(item), [] as Article[])
      .map((article) => ({
        ...article,
        tags: [ArticleSource.JavascriptWeekly, ...(article.tags || [])],
      }))
  );
};
