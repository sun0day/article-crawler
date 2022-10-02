export enum ArticleSource {
  JavascriptWeekly = "javascript-weekly",
}

export enum Lang {
  Javascript = "Javascript",
}

export interface Article {
  title?: string;
  author?: string;
  desc?: string;
  link?: string;
  html?: string;
  lang: Lang;
  tags: (string | ArticleSource)[];
}
