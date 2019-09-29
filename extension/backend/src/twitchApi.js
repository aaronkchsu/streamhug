const {
  bearerPrefix,
  makeServerToken,
  makeServerBroadcastToken
} = require("./authentication");

const request = require("request");
const asyncRequest = require("request-promise-native");

const { clientId, API_HOST, verboseLog } = require("./config");

async function getTwitchUserById(channelId, userId) {
  // Set the HTTP headers required by the Twitch API.
  const headers = {
    "Client-Id": "oafn7vvzfyzyccwrwrt233221oe5wq", // TODO: Don't hardcode this
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
    "Client-Id": "oafn7vvzfyzyccwrwrt233221oe5wq", // TODO: Don't hardcode this
    "Accept": 'application/vnd.twitchtv.v5+json',
    "Content-Type": "application/json",
    Authorization: bearerPrefix + makeServerToken(channelId)
  };

  const postUrl = `https://api.twitch.tv/kraken/users?login=${userNames.join(',')}`;

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

async function getTwitchAllUserStreamInfo(channelId, userIds) {
  // Set the HTTP headers required by the Twitch API.
  const headers = {
    "Client-Id": "oafn7vvzfyzyccwrwrt233221oe5wq", // TODO: Don't hardcode this
    "Accept": 'application/vnd.twitchtv.v5+json',
    "Content-Type": "application/json",
    Authorization: bearerPrefix + makeServerToken(channelId)
  };

  const postUrl = `https://api.twitch.tv/helix/streams?user_id=${userIds.join(',')}`;

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

async function getListOfTwitchSubscribers(channelId) {
  // Set the HTTP headers required by the Twitch API.
  const headers = {
    "Client-Id": "oafn7vvzfyzyccwrwrt233221oe5wq", // TODO: Don't hardcode this
    "Accept": 'application/vnd.twitchtv.v5+json',
    "Content-Type": "application/json",
    Authorization: bearerPrefix + makeServerToken(channelId)
  };

  const postUrl = `https://api.twitch.tv/kraken/channels/${channelId}/subscriptions`;

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

async function getTwitchChattersByUsername(username) {
  // Set the HTTP headers required by the Twitch API.
  const headers = {};

  const postUrl = `http://tmi.twitch.tv/group/user/${username}/chatters`;

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

async function getAllLiveTwitchUsers(channelId) {
  // Set the HTTP headers required by the Twitch API.
  const headers = {
    "Client-Id": "oafn7vvzfyzyccwrwrt233221oe5wq", // TODO: Don't hardcode this
    "Accept": 'application/vnd.twitchtv.v5+json',
    "Content-Type": "application/json",
    Authorization: bearerPrefix + makeServerToken(channelId)
  };

  const postUrl = `https://api.twitch.tv/extensions/oafn7vvzfyzyccwrwrt233221oe5wq/live_activated_channels`;
  let allStreamers = []
  const formData = {}

  return new Promise((resolve, reject) => {
    asyncRequest({
      method: "GET",
      uri: postUrl,
      body: JSON.stringify(formData),
      headers
    })
      .then(async (response) => {
          let currentResponse = JSON.parse(response)

          if(!currentResponse.channels || !currentResponse.channels.length) {
            resolve(allStreamers)
          }

          allStreamers = [...allStreamers, ...currentResponse.channels]
    
          while(currentResponse.cursor) {
              currentResponse = await asyncRequest({
                  method: "GET",
                  uri: `https://api.twitch.tv/extensions/oafn7vvzfyzyccwrwrt233221oe5wq/live_activated_channels?cursor=${currentResponse.cursor}`,
                  body: JSON.stringify(formData),
                  headers
                })
                currentResponse = JSON.parse(currentResponse)

                allStreamers = [...allStreamers, ...currentResponse.channels]
          }

          resolve(allStreamers)
      })
      .catch(err => {
        reject(err)
      });
  })
}

module.exports = {
  getTwitchChattersByUsername,
  getTwitchUserById,
  getTwitchAllUsersByNames,
  getTwitchAllUserStreamInfo,
  getListOfTwitchSubscribers,
  getAllLiveTwitchUsers
};
