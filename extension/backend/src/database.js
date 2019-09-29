// ============== DATABASE =============
const mongoose = require("mongoose");

// https://stackoverflow.com/questions/41394850/mongoerror-connection-0-to-localhost27017-timed-out
// https://mongoosejs.com/docs/connections.html
const options = {
  socketTimeoutMS: 45000,
  keepAlive: true,
  keepAliveInitialDelay: 300000,
  reconnectTries: 30000,
  useNewUrlParser: true
};

const mongodbUrl = process.env.MONGO_URI ? process.env.MONGO_URI : `mongodb://localhost:27017/twitchebs`;

console.log("MONGO CONNECTION STRING: ", mongodbUrl);

mongoose.Promise = global.Promise;
mongoose.connect(mongodbUrl, options);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", console.log.bind(console, "Database connected!!!"));

// ============== /DATABASE =============

module.exports = db;
