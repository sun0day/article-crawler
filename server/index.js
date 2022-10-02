const path = require("path");
const fastify = require("fastify")();
const { Crawler } = require(path.resolve("./dist/lib/crawler"));
const { jwCrawler } = require(path.resolve("./dist/crawler/javascript-weekly"));

const crawler = new Crawler();

fastify.register(require("@fastify/view"), {
  engine: {
    ejs: require("ejs"),
  },
  root: path.join(__dirname, "views"),
});

fastify.get("/", async (req, reply) => {
  const articles = await crawler.run([jwCrawler])

  return reply.view("/index.html", { articles });
});

crawler.init().then(
  () => {
    fastify.listen({ port: 3000 }, (err) => {
      if (err) throw err;
      console.log(`server listening on ${fastify.server.address().port}`);
    });
  }
)

process.on('uncaughtException', err => {
  console.error(error)
  crawler.close()
  process.exit(1)
})

process.on('SIGINT', () => {
  crawler.close()
  fastify.close()
  process.exit()
})

