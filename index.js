const {
  Crawler
} = require('./dist/lib/crawler')
const { jwCrawler } = require('./dist/crawler/javascript-weekly')

const c = new Crawler()
c.init().then(async () => {
  await c.run([jwCrawler])
  c.close()
})