const {
  verifyAndDecode,
  bearerPrefix,
  makeServerToken,
  makeServerBroadcastToken,
  makeServerTokenRole
} = require("../authentication");

const {
  getTwitchUserById,
  getTwitchChattersByUsername,
  getListOfTwitchSubscribers
} = require("../twitchApi");

const request = require("request");

const { clientId, API_HOST, verboseLog } = require("../config");

const { STRINGS } = require("../strings");
const ObjectID = require('mongodb').ObjectID;

const { getTwitchChannelSettings } = require("../models/twitchChannel");

const {
  ROOM_URL,
  findIsOnline
} = require("../memory/caches");

function sendChatMessageToChannel(channelId, message) {
  // Set the HTTP headers required by the Twitch API.
  const headers = {
    "Client-Id": clientId,
    "Content-Type": "application/json",
    Authorization: bearerPrefix + makeServerToken(channelId)
  };

  const body = JSON.stringify({
    text: message
  });

  const chatMessageUrl = `https://${API_HOST}/extensions/${clientId}/${process.env.ENV_VERSION}/channels/${channelId}/chat`;
  verboseLog("broadcast chat: ", message, " to ", chatMessageUrl);

  request(
    chatMessageUrl,
    {
      method: "POST",
      headers,
      body
    },
    (err, res) => {
      if (err) {
        console.log(STRINGS.messageSendError, channelId, err);
      } else {
        verboseLog(
          STRINGS.pubsubResponse,
          channelId,
          JSON.stringify(res.statusCode)
        );
      }
    }
  );
}

// Broadcasts to all viewers and strea=mers the new chan]nel set]tings
async function broadcastChannelSettingsUpdate(channelId) {
  // Set the HTTP headers required by the Twitch API.
  const headers = {
    "Client-Id": clientId,
    "Content-Type": "application/json",
    Authorization: bearerPrefix + makeServerBroadcastToken(channelId)
  };

  const twitchChannel = await getTwitchChannelSettings(channelId);
  const streamerInfo = await getTwitchUserById(channelId, channelId)

  const body = JSON.stringify({
    content_type: "application/json",
    message: JSON.stringify({
      twitchChannelSettings: {
        ...twitchChannel,
        audioBroadcastUrl: `${ROOM_URL}/pwn/${twitchChannel.roomId}`,
        channelCooldown: twitchChannel.channelCooldown.toString(),
        mpaaRating: twitchChannel.mpaaRating,
        bitCost: twitchChannel.globalBitCost.toString(),
        blastPrice: twitchChannel.blastPrice.toString(),
        selectedBoardIds: twitchChannel.selectedBoardIds,
        channelCooldown: twitchChannel.channelCooldown,
        globalBitCost: twitchChannel.globalBitCost,
        selectedBoardIds: twitchChannel.selectedBoardIds,
        specificBoardEnabled: twitchChannel.specificBoardEnabled,
        walkOnSetting: twitchChannel.walkOnSetting,
        roomId: twitchChannel.roomId,
        volume: twitchChannel.volume,
        isOnline: findIsOnline(channelId),
        isChatEnabled: twitchChannel.isChatEnabled
      },
      twitchStreamerInfo: streamerInfo
    }),
    targets: ["broadcast"]
  });

  request(
    `https://${API_HOST}/extensions/message/${channelId}`,
    {
      method: "POST",
      headers,
      body
    },
    (err, res) => {
      if (err) {
        verboseLog(STRINGS.messageSendError, channelId, err);
      } else {
        verboseLog(STRINGS.pubsubResponse, channelId, res.statusCode);
      }
    }
  );
}

module.exports = {
  sendChatMessageToChannel,
  broadcastChannelSettingsUpdate
};
