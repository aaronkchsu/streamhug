const path = require("path");
const ext = require("commander");
const STRINGS = require("./strings");

// Get options from the command line, environment, or, if local mode is
// enabled, the local value.
function getOption(optionName, environmentName, localValue) {
  const option = (() => {
    if (ext[optionName]) {
      return ext[optionName];
    } else if (process.env[environmentName]) {
      console.log(STRINGS[optionName + "Env"]);
      return process.env[environmentName];
    } else if (ext.isLocal && localValue) {
      console.log(STRINGS[optionName + "Local"]);
      return localValue;
    }
    console.log(STRINGS[optionName + "Missing"]);
    process.exit(1);
  })();
  console.log(`Using "${option}" for ${optionName}`);
  return option;
}

ext
  .version(require("../package.json").version)
  .option("-s, --secret <secret>", "Extension secret")
  .option("-c, --client-id <client_id>", "Extension client ID")
  .option("-o, --owner-id <owner_id>", "Extension owner ID")
  .option("-l, --is-local", "Developer rig local mode")
  .parse(process.argv);

const ownerId = getOption("ownerId", "ENV_OWNER_ID", "100000001");
const secret = Buffer.from(
  getOption(
    "secret",
    "ENV_SECRET",
    "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk"
  ),
  "base64"
);
let clientId;
if (ext.isLocal && ext.args.length) {
  const localFileLocation = path.resolve(ext.args[0]);
  clientId = require(localFileLocation).id;
}
clientId = getOption("clientId", "ENV_CLIENT_ID", clientId);

const API_HOST = ext.isLocal ? "localhost.rig.twitch.tv:3000" : "api.twitch.tv";

// Use verbose logging during development.  Set this to false for production.
const verboseLogging = true;
const verboseLog = verboseLogging ? console.log.bind(console) : () => {};

const CONFIG = {
  getOption,
  ownerId,
  clientId,
  secret,
  isLocal: ext.isLocal,
  API_HOST,
  verboseLog
}

module.exports = CONFIG;
