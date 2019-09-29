function missingOnline(name, variable) {
  const option = name.charAt(0);
  return `Extension ${name} required in online mode.\nUse argument "-${option} <${name}>" or environment variable "${variable}".`;
}

const STRINGS = {
  secretEnv: "Using environment variable for secret",
  clientIdEnv: "Using environment variable for client-id",
  ownerIdEnv: "Using environment variable for owner-id",
  secretLocal: "Using local mode secret",
  clientIdLocal: "Using local mode client-id",
  ownerIdLocal: "Using local mode owner-id",
  serverStarted: "Server running at %s",
  secretMissing: missingOnline("secret", "ENV_SECRET"),
  clientIdMissing: missingOnline("client ID", "ENV_CLIENT_ID"),
  ownerIdMissing: missingOnline("owner ID", "ENV_OWNER_ID"),
  messageSendError: "Error sending message to channel %s: %s",
  pubsubResponse: "Message to c:%s returned %s",
  cyclingColor: "Cycling color for c:%s on behalf of u:%s",
  colorBroadcast: "Broadcasting color %s for c:%s",
  sendColor: "Sending color %s to c:%s",
  cooldown: "Please wait before clicking again",
  invalidJwt: "Invalid JWT",
  invalidTransactionRec: "Invalid Transaction Receipt!",
  invalidAuthHeader: "Invalid authorization header",
  bitCostBroadcast: "Broadcasting bit costs %s for c:%s",
  sendBiteCost: "Sending bitcost %s to c:%s"
};

module.exports = {
  STRINGS,
  missingOnline
}
