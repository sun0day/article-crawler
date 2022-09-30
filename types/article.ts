export enum ArticleSource {
  JavascriptWeekly = "javascript-weekly",
}

export interface Article {
  title?: string;
  author?: string;
  desc?: string;
  link?: string;
  html?: string;
  tags: (string | ArticleSource)[];
}
