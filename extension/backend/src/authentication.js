const { secret, ownerId } = require("./config");
const STRINGS = require("./strings");
const Boom = require("boom");
const bearerPrefix = "Bearer "; // HTTP authorization headers have this prefix
const jwt = require("jsonwebtoken");
const serverTokenDurationSec = 30; // our tokens for pubsub expire after 30 seconds

// Verify the header and the enclosed JWT.
function verifyAndDecode(header) {
  if (header.startsWith(bearerPrefix)) {
    try {
      const token = header.substring(bearerPrefix.length);
      return jwt.verify(token, secret, { algorithms: ["HS256"] });
    } catch (ex) {
      throw Boom.unauthorized(STRINGS.invalidJwt);
    }
  }
  throw Boom.unauthorized(STRINGS.invalidAuthHeader);
}

// Create and return a JWT for use by this service.
function makeServerToken(channelId) {
  const payload = {
    exp: Math.floor(Date.now() / 1000) + serverTokenDurationSec,
    channel_id: "" + channelId,
    user_id: "" + ownerId, // extension owner ID for the call to Twitch PubSub
    role: "external",
    pubsub_perms: {
      send: ["*"]
    }
  };

  return jwt.sign(payload, secret, { algorithm: "HS256" });
}

function makeServerTokenRole(channelId, role) {
  const payload = {
    exp: Math.floor(Date.now() / 1000) + serverTokenDurationSec,
    channel_id: "" + channelId,
    user_id: "" + ownerId, // extension owner ID for the call to Twitch PubSub
    role: role,
    pubsub_perms: {
      send: ["*"]
    }
  };
  return jwt.sign(payload, secret, { algorithm: "HS256" });
}

function makeServerBroadcastToken(channelId) {
  const payload = {
    exp: Math.floor(Date.now() / 1000) + serverTokenDurationSec,
    channel_id: "" + channelId,
    user_id: "" + ownerId, // extension owner ID for the call to Twitch PubSub
    role: "external",
    pubsub_perms: {
      send: ["broadcast"]
    }
  };

  return jwt.sign(payload, secret, { algorithm: "HS256" });
}


module.exports = {
  verifyAndDecode,
  bearerPrefix,
  makeServerBroadcastToken,
  makeServerTokenRole,
  makeServerToken
}
