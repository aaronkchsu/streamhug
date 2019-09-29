import request from "request";
import projectConfig from "../env";

let twitch = window.Twitch.ext;

twitch.bits && twitch.bits.setUseLoopback(projectConfig.DEVELOPMENT);

/*
 * @callback example: function (target, contentType, retuurn object) {
 * }
 *
 * Reponse object returned from EBS
 */
export const subscribeToTwitchChannelSettings = callback => {
  // listen for incoming broadcast message from our EBS
  twitch.listen("broadcast", function(
    target,
    contentType,
    broadcastResponseObject
  ) {
    const BRO = JSON.parse(broadcastResponseObject) || broadcastResponseObject;
    if (BRO.twitchChannelSettings) {
      twitch.rig.log(
        "Received Twitch Settings ",
        BRO.twitchChannelSettings
      );
      callback(BRO.twitchChannelSettings);
    }
  });
};

/*
 * @callback example: function (target, contentType, retuurn object) {
 * }
 *
 * Reponse object returned from EBS
 */
export const subscribeToBoardSettings = callback => {
  // listen for incoming broadcast message from our EBS
  twitch.listen("broadcast", function(
    target,
    contentType,
    broadcastResponseObject
  ) {
    const BRO = JSON.parse(broadcastResponseObject) || broadcastResponseObject;
    if (
      BRO.selectedBoardIds !== null ||
      BRO.selectedBoardIds !== undefined ||
      (BRO.specificBoardEnabled === false || BRO.specificBoardEnabled === true)
    ) {
      twitch.rig.log(
        "Received global broadcast board settings",
        broadcastResponseObject
      );

      callback({
        selectedBoardIds: BRO.selectedBoardIds,
        specificBoardEnabled: BRO.specificBoardEnabled
      });
    }
  });
};

/*
 * @callback example: function (target, contentType, retuurn object) {
 * }
 *
 * Reponse object returned from EBS
 */
export const subscribeToBitCount = callback => {
  // listen for incoming broadcast message from our EBS
  twitch.listen("broadcast", function(
    target,
    contentType,
    broadcastResponseObject
  ) {
    const BRO = JSON.parse(broadcastResponseObject) || broadcastResponseObject;
    if (BRO.bitCost) {
      twitch.rig.log(
        "Received global broadcast globalBitCost ",
        broadcastResponseObject
      );
      callback(Number(BRO.bitCost));
    }
  });
};

/*
 * @callback example: function (target, contentType, retuurn object) {
 * }
 *
 * Reponse object returned from EBS
 */
export const subscribeToCooldownTime = callback => {
  // listen for incoming broadcast message from our EBS
  twitch.listen("broadcast", function(
    target,
    contentType,
    broadcastResponseObject
  ) {
    const BRO = JSON.parse(broadcastResponseObject) || broadcastResponseObject;
    if (BRO.channelCooldown) {
      twitch.rig.log(
        "Received global broadcast globalCooldownTime ",
        broadcastResponseObject
      );
      callback(Number(BRO.channelCooldown));
    }
  });
};

/*
 * @callback example:
 *
 * Response object returned from EBS
 */
export const subscribeToAudioUrl = callback => {
  // listen for incoming broadcast message from our EBS
  twitch.listen("broadcast", function(
    target,
    contentType,
    broadcastResponseObject
  ) {
    const BRO = JSON.parse(broadcastResponseObject) || broadcastResponseObject;
    if (BRO.audioUrl) {
      callback({ audioUrl: BRO.audioUrl, playInfo: BRO.playInfo });
    }
  });
};

/*
 * @callback https://dev.twitch.tv/docs/extensions/bits/#ontransactioncancelledcallback
 *
 */
export const subscribeTransactionCancelled = callback => {
  // If twitch bits do not exist
  if (!twitch.bits) {
    callback({ message: "Not Implemented" });
    return;
  }

  // listen for incoming broadcast message from our EBS
  twitch.bits.onTransactionCancelled(function(transactionObject) {
    twitch.rig.log("Received transaction complete from", transactionObject);
    callback(transactionObject);
  });
};

/*
 * @callback https://dev.twitch.tv/docs/extensions/bits/#ontransactioncompletecallbacktransactionobject
 *
 */
export const subscribeTransactionComplete = callback => {
  // If twitch bits do not exist
  if (!twitch.bits) {
    callback({ message: "Not Implemented" });
    return;
  }

  // listen for incoming broadcast message from our EBS
  twitch.bits.onTransactionComplete(function(transactionObject) {
    twitch.rig.log("Received transaction cancelled from", transactionObject);
    callback(transactionObject);
  });
};

const createRequestOptions = (method, form, bearerToken) => {
  const options = {
    headers: { Authorization: "Bearer " + bearerToken },
    method,
    form
  };
  return options;
};

export async function makePostBoardSettings({
  selectedBoardIds,
  specificBoardEnabled,
  bearerToken
}) {
  const uri = `${projectConfig.twitchHost}/board/settings`;
  const form = {
    selectedBoardIds: JSON.stringify(selectedBoardIds),
    specificBoardEnabled
  };
  const opt = createRequestOptions("POST", form, bearerToken);
  return asyncRequest(uri, opt);
}

export async function makePostPartyAction({
  blastBites,
  roomId,
  transactionObj,
  bearerToken
}) {
  const uri = `${projectConfig.twitchHost}/audio/party`;
  const form = {
    blastBites: JSON.stringify(blastBites),
    roomId,
    transactionObj: JSON.stringify(transactionObj)
  };
  const opt = createRequestOptions("POST", form, bearerToken);
  return asyncRequest(uri, opt);
}

export async function makePostGlobalBitCost({ bitCost, bearerToken }) {
  const uri = `${projectConfig.twitchHost}/bits/global`;
  const form = {
    bitCost
  };
  const opt = createRequestOptions("POST", form, bearerToken);
  return asyncRequest(uri, opt);
}

export async function makePostBlastPrice({ blastPrice, bearerToken }) {
  const uri = `${projectConfig.twitchHost}/channel/blastPrice`;
  const form = {
    blastPrice
  };
  const opt = createRequestOptions("POST", form, bearerToken);
  return asyncRequest(uri, opt);
}

export async function makePostGlobalCooldownTime({
  channelCooldown,
  bearerToken
}) {
  const uri = `${projectConfig.twitchHost}/cooldown/time`;
  const form = {
    channelCooldown
  };
  const opt = createRequestOptions("POST", form, bearerToken);
  return asyncRequest(uri, opt);
}

export async function makePostRefreshRoom({ bearerToken }) {
  const uri = `${projectConfig.twitchHost}/url/refresh`;
  const form = {};
  const opt = createRequestOptions("POST", form, bearerToken);
  return asyncRequest(uri, opt);
}

export async function makePostGlobalMpaaRating({ mpaaRating, bearerToken }) {
  const uri = `${projectConfig.twitchHost}/mpaa/rating`;
  const form = {
    mpaaRating
  };
  const opt = createRequestOptions("POST", form, bearerToken);
  return asyncRequest(uri, opt);
}

export async function makePostTwitchSetting({ walkOnSetting, bearerToken }) {
  const uri = `${projectConfig.twitchHost}/channel`;
  const form = {
    walkOnSetting
  };
  const opt = createRequestOptions("POST", form, bearerToken);
  return asyncRequest(uri, opt);
}

export async function makePostAudioUrlPlay({
  audioUrl,
  imageUrl,
  transactionObj,
  biteId,
  biteTitle,
  roomId,
  bearerToken
}) {
  const uri = `${projectConfig.twitchHost}/audio/play`;
  const form = {
    audioUrl,
    imageUrl,
    biteId,
    biteTitle,
    transactionObj: JSON.stringify(transactionObj),
    roomId
  };
  const opt = createRequestOptions("POST", form, bearerToken);
  return asyncRequest(uri, opt);
}

export async function makePostAudioUrlTest({
  bearerToken,
  roomId
}) {
  const uri = `${projectConfig.twitchHost}/audio/test`;
  const form = {
    roomId
  };
  const opt = createRequestOptions("POST", form, bearerToken);
  return asyncRequest(uri, opt);
}

export async function makePostChatEnabled({ isChatEnabled, bearerToken }) {
  const uri = `${projectConfig.twitchHost}/channel/chatEnabled`;
  const form = {
    isChatEnabled
  };
  const opt = createRequestOptions("POST", form, bearerToken);
  return asyncRequest(uri, opt);
}

export async function makePostChannelVolume({ volume, bearerToken }) {
  const uri = `${projectConfig.twitchHost}/channel/volume`;
  const form = {
    volume
  };
  const opt = createRequestOptions("POST", form, bearerToken);
  return asyncRequest(uri, opt);
}

export async function makeGetChannelSettingsAll({ bearerToken }) {
  const uri = `${projectConfig.twitchHost}/channel/all`;
  const opt = createRequestOptions("GET", {}, bearerToken);
  return asyncRequest(uri, opt);
}

export async function makeGetTransactions({ bearerToken, limit }) {
  const uri = `${projectConfig.twitchHost}/transactions/desc?limit=${limit
    ? limit
    : 40}`;
  const opt = createRequestOptions("GET", {}, bearerToken);
  return asyncRequest(uri, opt);
}

/*
 @params
 uri: string,
 opts: {
    headers: {}
   method: 'GET' | 'POST',
   form?: {},
   jar?: CookieJar,
   proxy?: string,
   strictSSL?: boolean,
 }
 */
export const asyncRequest = async (uri, opts) =>
  new Promise((resolve, reject) => {
    request(uri, opts, (error, res) => {
      if (error != null) {
        reject(error);
      }
      resolve(res);
    });
  });
