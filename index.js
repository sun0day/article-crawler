const {
  Crawler
} = require('./dist/lib/crawler')
const { jwTask } = require('./dist/task/javascript-weekly')

const c = new Crawler()
c.init().then(async () => {
  await c.run([jwTask])
  c.close()
})