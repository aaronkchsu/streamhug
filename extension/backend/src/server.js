const fs = require("fs");
const Hapi = require("hapi");
const path = require("path");
const { isLocal } = require("./config");

const server = new Hapi.Server({
  host: "0.0.0.0",
  port: process.env.PORT || 5000,
  tls: isLocal
    ? {
        // If you need a certificate, execute "npm run cert".
        key: fs.readFileSync(
          path.resolve(__dirname, "..", "conf", "server.key")
        ),
        cert: fs.readFileSync(
          path.resolve(__dirname, "..", "conf", "server.crt")
        )
      }
    : undefined,
  routes: {
    cors: {
      origin: ["*"]
    }
  }
});

module.exports = server
