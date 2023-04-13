const http = require("http");
const app = require("./app");

const keepAlive = require("./keepAlive");

const server = http.createServer(app);
const serverless = require("serverless-http");

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

// server listening
// module.exports.handler = serverless(
//   server.listen(port, () => {
//     console.log(`Server running on port ${port}`);
//     keepAlive();
//   })
// );

module.exports = server.listen(port, () => {
  console.log(`Server running on port ${port}`);
  keepAlive();
});
