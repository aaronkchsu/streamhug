
const bearerPrefix = "Bearer "; // HTTP authorization headers have this prefix

const request = require("request");

const jwt = require("jsonwebtoken");

const secret = Buffer.from(
  "lhKjtNTTXWtEujOqDxepmN6ylkOJ2QWflLJOAA85kXo=",
  "base64"
);

// Create and return a JWT for use by this service.
function makeServerToken(channelId) {
  const payload = {
    exp: Math.floor(Date.now() / 1000) + 1000,
    channel_id: "" + channelId,
    user_id: "" + "253326823", // extension owner ID for the call to Twitch PubSub
    role: "external",
    pubsub_perms: {
      send: ["*"]
    }
  };

  return jwt.sign(payload, secret, { algorithm: "HS256" });
}

async function getTwitchUserById(channelId, userId) {
  // Set the HTTP headers required by the Twitch API.
  const headers = {
    "Client-Id": "2ajtntm2yj63xkb4hrdng9xvdx236p", // TODO: Don't hardcode this
    "Accept": 'application/vnd.twitchtv.v5+json',
    "Content-Type": "application/json",
    Authorization: bearerPrefix + makeServerToken(channelId)
  };

  const postUrl = `https://api.twitch.tv/kraken/users/${userId}`;

  return new Promise((resolve, reject) => {
      request(
          postUrl,
          {
            method: "GET",
            headers
          },
          (err, res) => {
            if (err) {
              reject(err)
            } else {
              resolve(JSON.parse(res.body))
            }
          }
        );
  })
}

async function getTwitchAllUsersByNames(channelId, userNames) {
  // Set the HTTP headers required by the Twitch API.
  const headers = {
    "Client-Id": "2ajtntm2yj63xkb4hrdng9xvdx236p", // TODO: Don't hardcode this
    "Accept": 'application/vnd.twitchtv.v5+json',
    "Content-Type": "application/json",
    Authorization: bearerPrefix + makeServerToken(channelId)
  };
  

  const postUrl = `https://api.twitch.tv/kraken/users?login=${userNames.join(',')}`;
  console.log("CHECKING", postUrl)

  return new Promise((resolve, reject) => {
      request(
          postUrl,
          {
            method: "GET",
            headers
          },
          (err, res) => {
            if (err) {
              reject(err)
            } else {
              console.log("CHECKING", res.body)
              resolve(JSON.parse(res.body))
            }
          }
        );
  })
}

console.log("CHECKING HERE")

async function main() {
  console.log("CHECKING HERE!!")
  await getTwitchAllUsersByNames(253326823, ["blerp", "yourcutefriend", "aaronkc", "fabledfoxy", "cispy", "cheezynerd"])
}

main()