require('dotenv').config()

const Boom = require('boom');
const jwt = require('jsonwebtoken');
const request = require('request');
const { STRINGS } = require('./strings');
const ObjectID = require('mongodb').ObjectID;
const ApolloClient = require('./apolloClient')
const gql = require('graphql-tag');
const BetterQueue = require('better-queue');

const { clientId, ownerId, secret, isLocal, API_HOST, verboseLog } = require('./config');

const { createTransaction, findTransactionsByChannelId, findTransactionsByChannelIdAndDate } = require('./models/transaction');

const allStreamers = [
  {
     "display_name":"blerp",
     "_id":"253326823",
     "name":"blerp",
     "type":"user",
     "bio":"The soundboard to end all soundboards! - https://blerp.com",
     "created_at":"2018-08-30T06:22:08.015625Z",
     "updated_at":"2019-09-28T15:31:55.443125Z",
     "logo":"https://static-cdn.jtvnw.net/jtv_user_pictures/6fb5ef7a-b193-4ec1-9fc4-cc9750a3b128-profile_image-300x300.png"
  },
  {
     "display_name":"yourcutefriend",
     "_id":"403127532",
     "name":"yourcutefriend",
     "type":"user",
     "bio":null,
     "created_at":"2018-12-20T03:42:56.6163Z",
     "updated_at":"2019-06-29T20:27:59.475008Z",
     "logo":"https://static-cdn.jtvnw.net/user-default-pictures/0ecbb6c3-fecb-4016-8115-aa467b7c36ed-profile_image-300x300.jpg"
  },
  {
     "display_name":"aaronkc",
     "_id":"55810970",
     "name":"aaronkc",
     "type":"user",
     "bio":"Engineer, Content Creator, and Inventor",
     "created_at":"2014-01-30T06:19:43.642549Z",
     "updated_at":"2019-09-26T15:51:33.173774Z",
     "logo":"https://static-cdn.jtvnw.net/jtv_user_pictures/ef522b6e-48cf-4632-a31a-0726348ee280-profile_image-300x300.jpeg"
  }
]

const myHugs = [

]

const otherHugs = [

]


const {
  getTwitchUserById,
  getTwitchChattersByUsername,
  getListOfTwitchSubscribers,
  getTwitchAllUserStreamInfo,
  getAllLiveTwitchUsers
} = require("./twitchApi");

const {
  setChannelSubscriberWalkOnSetting,
  setChannelMpaaRating,
  setChannelGlobalBitCost,
  setChannelBlastPrice,
  setChannelChannelCooldown,
  setChannelBoardItems,
  setChannelGlobalVolume,
  setChannelIsChatEnabled,
  refreshChannelRoomId,
  findOrCreateDefaults,
  getTwitchChannelSettings,
  getTwitchChannelSettingsByRoomIds,
  addNewWalkOnSubscriptionIdToChannel,
  removeWalkOnSubscriptionIdToChannel
} = require('./models/twitchChannel');

const {
  getAllWalkOnSubscriptions,
  findOrCreateWalkOnSubscription,
  setWalkOnBiteIds,
  setWalkOnEnabled,
  setWalkOnLastPlayed
} = require('./models/walkOnSubscription');

const {
  addNewWalkOnSubscriptionIdToViewer,
  removeWalkOnSubscriptionIdToViewer,
  TwitchViewerModel,
  getTwitchViewer
} = require('./models/twitchViewer');

const { verifyAndDecode } = require('./authentication');

const { sendChatMessageToChannel, broadcastChannelSettingsUpdate } = require('./responses');

const { LIVE_STREAMER_SOCKETS, findIsOnline } = require('./memory/caches');

const server = require('./server');
const io = require('socket.io')(server.listener);

const { getHeathCheck } = require('./handlers');

const database = require('./database');

const { channelRateLimitCooldown, ROOM_URL } = require('./memory/caches');

// The developer rig uses self-signed certificates.  Node doesn't accept them
// by default.  Do not use this in production.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Service state variables
let userCooldowns = {}; // spam prevention
const userCooldownClearIntervalMs = 60000; // interval to reset our tracking object
const channelCooldownMs = 1000; // maximum broadcast rate per channel

// ================================================================
// START: Routing Handlers
// ================================================================

async function streamerSetBoardOnlySettings(req) {
  // Verify all requests.
  const payload = verifyAndDecode(req.headers.authorization);
  const { channel_id: channelId, opaque_user_id: opaqueUserId } = payload;

  // Store the bitcost for the channel.
  let selectedBoardIds = req.payload && req.payload.selectedBoardIds ? JSON.parse(req.payload.selectedBoardIds) : null;

  let specificBoardEnabled = req.payload && req.payload.specificBoardEnabled ? req.payload.specificBoardEnabled : null;

  // Save the new bitcost for the channel in cache and db.
  await setChannelBoardItems(channelId, specificBoardEnabled, selectedBoardIds);

  await broadcastChannelSettingsUpdate(channelId);

  return {
    selectedBoardIds: selectedBoardIds,
    specificBoardEnabled: specificBoardEnabled
  };
}

async function streamerSetBitCostHandler(req) {
  // Verify all requests.
  const payload = verifyAndDecode(req.headers.authorization);
  const { channel_id: channelId, opaque_user_id: opaqueUserId } = payload;

  // Store the bitcost for the channel.
  let currentBitCost = req.payload && req.payload.bitCost;

  // Save the new bitcost for the channel in cache and db.
  await setChannelGlobalBitCost(channelId, currentBitCost);
  await broadcastChannelSettingsUpdate(channelId);

  return currentBitCost;
}

async function streamerSetBlastPriceHandler(req) {
  // Verify all requests.
  const payload = verifyAndDecode(req.headers.authorization);
  const { channel_id: channelId, opaque_user_id: opaqueUserId } = payload;

  // Store the bitcost for the channel.
  let blastPrice = req.payload && req.payload.blastPrice;

  // Save the new bitcost for the channel in cache and db.
  await setChannelBlastPrice(channelId, blastPrice);
  await broadcastChannelSettingsUpdate(channelId);

  return blastPrice;
}

async function streamerSetMpaaHandler(req) {
  // Verify all requests.
  const payload = verifyAndDecode(req.headers.authorization);
  const { channel_id: channelId, opaque_user_id: opaqueUserId } = payload;

  // Store the bitcost for the channel.
  let currentMpaaRating = req.payload && req.payload.mpaaRating;

  await setChannelMpaaRating(channelId, currentMpaaRating);
  await broadcastChannelSettingsUpdate(channelId);

  return currentMpaaRating;
}

// Newest endpoint for changing Twitch channel settings
// Only walk on setting is supported here let's consolidate all the endpoints and add support here in the future
async function streamerSetTwitchChannel(req) {
  // Verify all requests.
  const payload = verifyAndDecode(req.headers.authorization);
  const { channel_id: channelId, opaque_user_id: opaqueUserId } = payload;

  // Store the bitcost for the channel.
  let walkOnSetting = req.payload && req.payload.walkOnSetting;

  if (walkOnSetting) {
    await setChannelSubscriberWalkOnSetting(channelId, walkOnSetting);
  }

  // End of updating broadcast all the settings to everyone
  await broadcastChannelSettingsUpdate(channelId);
  return walkOnSetting;
}

async function streamerSetVolumeHandler(req) {
  // Verify all requests.
  const payload = verifyAndDecode(req.headers.authorization);
  const { channel_id: channelId, opaque_user_id: opaqueUserId } = payload;

  // Store the bitcost for the channel.
  let volume = req.payload && req.payload.volume;

  await setChannelGlobalVolume(channelId, volume);
  await broadcastChannelSettingsUpdate(channelId);

  return volume;
}

async function streamerSetIsChatEnabledHandler(req) {
  // Verify all requests.
  const payload = verifyAndDecode(req.headers.authorization);
  const { channel_id: channelId, opaque_user_id: opaqueUserId } = payload;

  // Store the chatEnabled for the channel.
  let isChatEnabled = req.payload && req.payload.isChatEnabled;

  await setChannelIsChatEnabled(channelId, isChatEnabled);
  await broadcastChannelSettingsUpdate(channelId);

  return isChatEnabled;
}

async function refreshBroadcastUrl(req) {
  // Verify all requests.
  const payload = verifyAndDecode(req.headers.authorization);
  const { channel_id: channelId, opaque_user_id: opaqueUserId } = payload;

  await refreshChannelRoomId(channelId);
  const socketKey = Object.keys(LIVE_STREAMER_SOCKETS).find(key => LIVE_STREAMER_SOCKETS[key].channelId === channelId);
  if (socketKey && LIVE_STREAMER_SOCKETS[socketKey]) {
    delete LIVE_STREAMER_SOCKETS[socketKey]
  }
  await broadcastChannelSettingsUpdate(channelId);
  return true;
}

async function streamerSetChannelCooldownHandler(req) {
  // Verify all requests.
  const payload = verifyAndDecode(req.headers.authorization);
  const { channel_id: channelId, opaque_user_id: opaqueUserId } = payload;

  // Store the currentChannelCooldown for the channel.
  let currentChannelCooldown = req.payload && req.payload.channelCooldown;

  // Save the new rating for the channel.
  await setChannelChannelCooldown(channelId, currentChannelCooldown);
  await broadcastChannelSettingsUpdate(channelId);

  return currentChannelCooldown;
}

const TEST_URLS = [
  {audioUrl: 'https://audio.blerp.com/audio/e322c4f0-de62-465f-8ea8-bf1c1584126e?type=MP3', imageUrl: "https://media.tenor.com/images/583da0ccad4db5ef9be88f7c27560f4f/tenor.gif"},
  {audioUrl: 'https://audio.blerp.com/audio/7792b1b0-fa45-11e8-9af2-7b8acf59eb77?type=MP3', imageUrl: "https://image.blerp.com/image/76c68810-fa45-11e8-9af2-7b8acf59eb77?h=100&w=100&type=ORIGINAL"},
  {audioUrl: 'https://audio.blerp.com/audio/cb6f69b4-cdfc-4dd4-9b34-55189e612bfd?type=MP3', imageUrl: "https://media.tenor.com/images/e1d470401940172b3ddc7765ddca69c2/tenor.gif"},
  {audioUrl: 'https://audio.blerp.com/audio/6a399cb0-fa48-11e8-9af2-7b8acf59eb77?type=MP3', imageUrl: "https://image.blerp.com/image/91972ad0-0202-437f-9f79-db28a2a12dca?h=100&w=100&type=ORIGINAL"},
  {audioUrl: 'https://audio.blerp.com/audio/d7efaae2-65ac-4f16-ad94-a252f9641c65?type=MP3', imageUrl: "https://media.tenor.com/images/27880750a784d3a3f71101c936304db1/tenor.gif"},
  {audioUrl: 'https://audio.blerp.com/audio/f52de160-a7a4-11e8-90d2-9105342711df?type=MP3', imageUrl: "https://image.blerp.com/image/91972ad0-0202-437f-9f79-db28a2a12dca?h=100&w=100&type=ORIGINAL"},
  {audioUrl: 'https://audio.blerp.com/audio/f7ebbc60-089d-11e9-a023-510d7b579102?type=MP3', imageUrl: "https://media.tenor.com/images/4c57b572e8fcbec9b1b73d1d11216a10/tenor.gif"},
  {audioUrl: 'https://audio.blerp.com/audio/16ecd4e0-fa44-11e8-9af2-7b8acf59eb77?type=MP3', imageUrl: ""},
  {audioUrl: 'https://audio.blerp.com/audio/e03a02b0-78fc-11e8-8637-dd8dbcb2ca6a?type=MP3', imageUrl: "https://image.blerp.com/image/default2-a89e-4a33-8a26-4fff77cd9607?h=100&w=100&type=ORIGINAL"}
];

function testAudioClipHandler(io) {
  return async function innerFunction(req) {
    // Verify all requests are coming from twitch.
    const payload = verifyAndDecode(req.headers.authorization);
    const { channel_id: channelId, opaque_user_id: opaqueUserId } = payload;
    const roomId = req.payload && req.payload.roomId;

    const twitchChannel = await getTwitchChannelSettings(channelId);
    const volume = twitchChannel.volume;
    const randomObject = TEST_URLS[Math.floor(Math.random() * TEST_URLS.length)]
    const audioUrl = randomObject.audioUrl;
    const imageUrl = randomObject.imageUrl;

    io.to(roomId).emit('play audio', {
      userName: 'Favorite Viewer',
      bitCost: 10000,
      audioUrl,
      imageUrl,
      volume,
      audioVolume: `${audioUrl}#${volume}`,
      biteTitle: 'Best Blerp Title Eva!'
    });

    return true;
  };
}

function playAudioClipHandlerIo(io) {
  return async function playAudioClipHandler(req) {
    // Verify all requests are coming from twitch.
    const payload = verifyAndDecode(req.headers.authorization);
    const { channel_id: channelId, opaque_user_id: opaqueUserId, user_id: userId } = payload;

    console.log('Posting from channel : ', channelId, ' : to user :', opaqueUserId, ' ');

    // Grab the url to play
    let audioUrl = req.payload && req.payload.audioUrl;
    let imageUrl = req.payload && req.payload.imageUrl;
    let biteId = req.payload && req.payload.biteId;
    let biteTitle = req.payload && req.payload.biteTitle;
    let roomId = req.payload && req.payload.roomId;

    let transactionObject = req.payload && req.payload.transactionObj && JSON.parse(req.payload.transactionObj);

    const twitchChannel = await getTwitchChannelSettings(channelId);
    const currentBitCost = twitchChannel.globalBitCost;
    const blastPrice = twitchChannel.blastPrice;

    const transaction = await createTransaction({
      transactionDetails: transactionObject,
      biteId,
      audioUrl,
      biteTitle,
      currentChannelBitCost: currentBitCost,
      channelId: channelId,
      blastPrice: blastPrice,
      blastBites: null
    });

    // Only check if the current bitcost is not free!
    const isStreamer = userId === channelId
    if (Number(currentBitCost) !== 0 && !isStreamer) {
      const transactionId = transactionObject ? transactionObject.transactionId : null;
      console.log('TRANSACTION Is not Free', transactionId);

      try {
        const jwtRec = transactionObject.transactionReceipt;
        jwt.verify(jwtRec, secret, { algorithms: [ 'HS256' ] });
      } catch (ex) {
        console.log(STRINGS.invalidTransactionRec);
        throw Boom.unauthorized(STRINGS.invalidJwt);
      }

      if (!transactionId) {
        throw Boom.unauthorized(STRINGS.invalidTransactionRec);
      }
    }

    let userObject;
    let displayName;
    const hasDisplayName = !!(transactionObject && transactionObject.displayName)
    if(!(hasDisplayName) && userId) {
      try {
        userObject = await getTwitchUserById(channelId, userId)
        displayName = (userObject && userObject.name) ? userObject.name : null
      } catch(err) {
        console.log("FAILED FETCHING USER", err)
      }
    }

    // If this is a paid transaction then tell the chat how much it was
    if (transactionObject) {
      console.log(
        'Sending to chat ',
        `${transactionObject && transactionObject.displayName} used ${transactionObject &&
          transactionObject.product &&
          transactionObject.product.cost &&
          transactionObject.product.cost.amount} using Blerp! In channel ${channelId}`
      );
      if (twitchChannel.isChatEnabled) {
        try {
          sendChatMessageToChannel(
            channelId,
            `${transactionObject && transactionObject.displayName} used ${transactionObject &&
              transactionObject.product &&
              transactionObject.product.cost &&
              transactionObject.product.cost
                .amount} bits to play "${biteTitle}" - https://blerp.com/soundbites/${biteId}!`
          );
        } catch (err) {
          console.log("ERROR SENDING TO CHAT", err)
        }
      }
    } else {
      // Free transaction
      console.log(`Playing "${biteTitle}" - https://blerp.com/soundbites/${biteId}! In channel ${channelId}`);
      if (twitchChannel.isChatEnabled) {
        try {
          sendChatMessageToChannel(channelId, `${displayName ? displayName : "Anonymous"} is playing "${biteTitle}" - https://blerp.com/soundbites/${biteId}!`);
        } catch (err) {
          console.log("ERROR SENDING TO CHAT", err)
        }
      }
    }

    // Bot abuse prevention: don't allow a user to spam the button.
    if (userIsInCooldown(opaqueUserId)) {
      throw Boom.tooManyRequests(STRINGS.cooldown);
    }

    // New way of playing through a socket
    const AudioPlayInfo = `${audioUrl}#${twitchChannel.volume}`;
    io.to(roomId).emit('play audio', {
      audioVolume: AudioPlayInfo,
      audioUrl,
      imageUrl,
      volume: twitchChannel.volume,
      userName:  displayName ? displayName : transactionObject ? transactionObject.displayName : 'Anonymous',
      bitCost: currentBitCost,
      biteTitle: biteTitle
    });

    return true;
  };
}

function playPartyAudioClipHandlerIo(io) {
  return async function playPartyAudioClipHandler(req) {
    // Verify all requests are coming from twitch.
    const payload = verifyAndDecode(req.headers.authorization);
    const { channel_id: channelId, opaque_user_id: opaqueUserId, user_id: userId } = payload;

    console.log('Posting from channel : ', channelId, ' : to user :', opaqueUserId, ' ');

    let preBlastBites = req.payload && JSON.parse(req.payload.blastBites);
    // Limit to 5 blast blerps for now | maybe increase in the future
    let blastBites = preBlastBites.slice(0, 5);
    let roomId = req.payload && req.payload.roomId;

    let transactionObject = req.payload && req.payload.transactionObj && JSON.parse(req.payload.transactionObj);

    const twitchChannel = await getTwitchChannelSettings(channelId);
    const currentBitCost = twitchChannel.globalBitCost;
    const blastPrice = twitchChannel.blastPrice;

    const transaction = await createTransaction({
      transactionDetails: transactionObject,
      biteId: blastBites[0].id,
      audioUrl: blastBites[0].audioUrl,
      biteTitle: 'Blerp Blast!',
      blastBites: blastBites,
      currentChannelBitCost: currentBitCost,
      blastPrice,
      channelId: channelId
    });

    // Only check if the current bitcost is not free!
    const isStreamer = userId === channelId
    if (Number(blastPrice) !== 0 && !isStreamer) {
      const transactionId = transactionObject ? transactionObject.transactionId : null;
      console.log('TRANSACTION Is not Free', transactionId);

      try {
        const jwtRec = transactionObject.transactionReceipt;
        jwt.verify(jwtRec, secret, { algorithms: [ 'HS256' ] });
      } catch (ex) {
        console.log(STRINGS.invalidTransactionRec);
        throw Boom.unauthorized(STRINGS.invalidJwt);
      }

      if (!transactionId) {
        throw Boom.unauthorized(STRINGS.invalidTransactionRec);
      }
    }

    let userObject;
    let displayName;
    const hasDisplayName = !!(transactionObject && transactionObject.displayName)
    if(!(hasDisplayName) && userId) {
      try {
        userObject = await getTwitchUserById(channelId, userId)
        displayName = (userObject && userObject.name) ? userObject.name : null
      } catch(err) {
        console.log("FAILED FETCHING USER", err)
      }
    }

    // If this is a paid transaction then tell the chat how much it was
    if (transactionObject) {
      console.log(
        'Sending to chat ',
        `${transactionObject && transactionObject.displayName} used ${transactionObject &&
          transactionObject.product &&
          transactionObject.product.cost &&
          transactionObject.product.cost.amount} using Blerp! In channel ${channelId}`
      );
      if (twitchChannel.isChatEnabled) {
        try {
          sendChatMessageToChannel(
            channelId,
            `${transactionObject && transactionObject.displayName} used ${transactionObject &&
              transactionObject.product &&
              transactionObject.product.cost &&
              transactionObject.product.cost.amount} bits to play blast Blerps!! - https://blerp.com/soundbites/${blastBites[0].id}!`
          );
        } catch (err) {
          console.log("ERROR SENDING TO CHAT", err)
        }
      }
    } else {
      if (twitchChannel.isChatEnabled) {
        try {
          sendChatMessageToChannel(
            channelId,
            `${displayName ? displayName : "Anonymous"} is Blasting Blerps! "${blastBites[0].title}" - https://blerp.com/soundbites/${blastBites[0].id}!`
          );
        } catch (err) {
          console.log("ERROR SENDING TO CHAT", err)
        }
      }
    }

    // New way of playing through a socket
    io.to(roomId).emit('play blast', {
      volume: twitchChannel.volume,
      bitCost: currentBitCost,
      userName:  displayName ? displayName : transactionObject ? transactionObject.displayName : 'Anonymous',
      blastBites: JSON.stringify(blastBites)
    });

    return true;
  };
}

async function mongoTest(req) {
  const twitchChannel = await getTwitchChannelSettings(channelId);
  return true;
}

async function getBroadcastScreen(req, h) {
  // TODO: Verify all requests?
  // const payload = verifyAndDecode(req.headers.authorization);
  // const { channel_id: channelId, opaque_user_id: opaqueUserId } = payload;
  return h.file(`${__dirname}/static/index.html`);
}

async function getTransactionsByDesDate(req) {
  // Verify all requests.
  const payload = verifyAndDecode(req.headers.authorization);

  const { channel_id: channelId, opaque_user_id: opaqueUserId } = payload;

  let limit = (req.query && Number(req.query.limit)) || 20;

  const transactions = await findTransactionsByChannelId({
    channelId,
    limit: limit
  });

  return transactions;
}

async function getGlobalTwitchChannelSettings(req) {
  // Verify all requests.
  const payload = verifyAndDecode(req.headers.authorization);

  // Get the color for the channel from the payload and return it.
  const { channel_id: channelId, opaque_user_id: opaqueUserId, user_id: userId } = payload;

  const twitchChannel = await getTwitchChannelSettings(channelId);

  verboseLog(STRINGS.sendBiteCost, twitchChannel.globalBitCost, channelId);

  // currently limit the amount of subscriptions you can see
  const LIMIT = 100
  const limitedIds = twitchChannel.walkOnSubscriptionIds.slice(0, LIMIT)
  let walkOnSubscriptions = []

  if (userId) {
    walkonSubscriptions = await getAllWalkOnSubscriptions(limitedIds) 
  }

  const streamerInfo = await getTwitchUserById(channelId, channelId)
  
  return {
    ...twitchChannel,
    walkOnSetting: twitchChannel,
    channelCooldown: twitchChannel.channelCooldown,
    blastPrice: twitchChannel.blastPrice,
    bitCost: twitchChannel.globalBitCost,
    globalBitCost: twitchChannel.globalBitCost,
    mpaaRating: twitchChannel.mpaaRating,
    selectedBoardIds: twitchChannel.selectedBoardIds,
    specificBoardEnabled: twitchChannel.specificBoardEnabled,
    audioBroadcastUrl: `${ROOM_URL}/pwn/${twitchChannel.roomId}`,
    roomId: twitchChannel.roomId,
    volume: twitchChannel.volume,
    isOnline: findIsOnline(channelId),
    isChatEnabled: twitchChannel.isChatEnabled,
    twitchStreamerInfo: streamerInfo,
    walkOnSubscriptions
  };
}

let arrayLiveCache = []
const CACHE_TIME_LIMIT = 10 * 60 * 1000 // Ten Minutes

function compareTransactions( a, b ) {
  if ( a.weeklyBlerpBits > b.weeklyBlerpBits ){
    return -1;
  }
  if ( a.weeklyBlerpBits < b.weeklyBlerpBits ){
    return 1;
  }
  return 0;
}

function removeDuplicates(arr) {
  var obj = {};
  var ret_arr = [];
  for (var i = 0; i < arr.length; i++) {
      obj[arr[i]] = true;
  }
  for (var key in obj) {
      ret_arr.push(key);
  }
  return ret_arr;
}

async function getGlobalTwitchChannelLiveStreamers(req) {
  if(arrayLiveCache.length) {
    return arrayLiveCache
  }
  const allChannelObjects = await getAllLiveTwitchUsers(ownerId)

  const filteredTwitch = allChannelObjects.map(async (userObject) => {
    const streamerInfoCheck = await getTwitchAllUserStreamInfo(userObject.id, [userObject.id])
    if (!streamerInfoCheck.data) {
      return null
    }
    const moreUser = await getTwitchUserById(userObject.id, userObject.id);
    const isStreamOnline = streamerInfoCheck.data[0] && streamerInfoCheck.data[0].type === "live" ? true : false
    const thumbnailUrl = streamerInfoCheck.data[0] && streamerInfoCheck.data[0].thumbnail_url
    const transactions = await findTransactionsByChannelIdAndDate(
      {
        channelId: userObject.id,
        limit: 100000000,
        date: new Date(Date.now() - (7 * 24 * 60 * 60 * 1000)) // 1 week ago
      }
    )

    let weeklyBlerpBits = 0
    
    if(transactions.length) {
      weeklyBlerpBits = transactions.reduce((preV, curV) => {
        if(curV.transactionDetails && curV.transactionDetails.product && curV.transactionDetails.product.cost) {
          return preV + curV.transactionDetails.product.cost.amount
        } else {
          return preV
        }
      }, 0)
    }

    return {
      channelId: userObject.id,
      weeklyBlerpBits,
      isStreamOnline,
      thumbnailUrl,
      ...userObject,
      ...moreUser
    };
  });

  setTimeout(() => {
    arrayLiveCache = []
  }, CACHE_TIME_LIMIT)

  arrayLiveCache = await Promise.all(filteredTwitch)
  const doubleFilteredTwitch = arrayLiveCache.filter(Boolean)
  doubleFilteredTwitch.sort(compareTransactions)
  arrayLiveCache = doubleFilteredTwitch.slice(0, 50)
  return arrayLiveCache;
}

// ================================================================
// END: Routing Handlers
// ================================================================

function userIsInCooldown(opaqueUserId) {
  // Check if the user is in cool-down.
  const cooldown = userCooldowns[opaqueUserId];
  const now = Date.now();
  if (cooldown && cooldown > now) {
    return true;
  }
  return false;
}

// Define routes here
(async () => {
  await server.register(require('inert'));

  io.on('connection', async function(socket) {
    if (!socket.handshake.query.roomId) {
      socket.disconnect();
      throw Boom.notFound('Cannot find the requested page');
    }

    if (socket.handshake.query.roomId.length !== 24) {
      socket.disconnect();
      throw Boom.notFound('RoomId is invalid!');
    }

    const twitchChannels = await getTwitchChannelSettingsByRoomIds([ socket.handshake.query.roomId ]);
    const channelId = twitchChannels[0] && twitchChannels[0].channelId;

    if (!channelId) {
      socket.disconnect();
      throw Boom.notFound('ChannelId not found!');
    }

    LIVE_STREAMER_SOCKETS[socket.id] = {
      channelId: channelId,
      roomId: socket.handshake.query.roomId
    };

    console.log('Twitch streamer connected', channelId);
    await broadcastChannelSettingsUpdate(channelId);
    // Only broadcast to the channel's roomId
    socket.join(socket.handshake.query.roomId);
    socket.on('disconnect', async function() {
      if (LIVE_STREAMER_SOCKETS[socket.id]) {
        delete LIVE_STREAMER_SOCKETS[socket.id];
      }
      console.log('Twitch streamer disconnected', channelId);
      await broadcastChannelSettingsUpdate(channelId);
    });
  });

  // Handle a request on setting the bitcost
  server.route({
    method: 'POST',
    path: '/mpaa/rating',
    handler: streamerSetMpaaHandler
  });

  server.route({
    method: 'POST',
    path: '/channel',
    handler: streamerSetTwitchChannel
  });

  server.route({
    method: 'POST',
    path: '/channel/volume',
    handler: streamerSetVolumeHandler
  });

  server.route({
    method: 'POST',
    path: '/channel/chatEnabled',
    handler: streamerSetIsChatEnabledHandler
  });

  server.route({
    method: 'POST',
    path: '/url/refresh',
    handler: refreshBroadcastUrl
  });

  server.route({
    method: 'POST',
    path: '/cooldown/time',
    handler: streamerSetChannelCooldownHandler
  });

  server.route({
    method: 'POST',
    path: '/board/settings',
    handler: streamerSetBoardOnlySettings
  });

  server.route({
    method: 'POST',
    path: '/bits/global',
    handler: streamerSetBitCostHandler
  });

  server.route({
    method: 'POST',
    path: '/channel/blastPrice',
    handler: streamerSetBlastPriceHandler
  });

  // Handle requests on broadcasting a play to streamer
  server.route({
    method: 'POST',
    path: '/audio/play',
    handler: playAudioClipHandlerIo(io)
  });

  // Handle requests on broadcasting a play to streamer
  server.route({
    method: 'POST',
    path: '/audio/party',
    handler: playPartyAudioClipHandlerIo(io)
  });

  const testAudioHandler = testAudioClipHandler(io);

  server.route({
    method: 'POST',
    path: '/audio/test',
    handler: testAudioHandler
  });

  server.route({
    method: 'GET',
    path: '/transactions/desc',
    handler: getTransactionsByDesDate
  });

  // Handle the requests for current bitcount on costs.
  server.route({
    method: 'GET',
    path: '/channel/all',
    handler: getGlobalTwitchChannelSettings
  });

  // Handle the requests for current bitcount on costs.
  server.route({
    method: 'GET',
    path: '/channels/live',
    handler: getGlobalTwitchChannelLiveStreamers
  });

  // Handle a request to see if the server is alive
  server.route({
    method: 'GET',
    path: '/pwn/{roomId}',
    handler: getBroadcastScreen,
    config: {
      auth: false,
      cors: { origin: [ '*' ] }
    }
  });

  // Handle a request to see if the server is alive
  server.route({
    method: 'GET',
    path: '/',
    handler: getHeathCheck
  });

  // Handle a request to see if the server is alive
  server.route({
    method: 'POST',
    path: '/test',
    handler: mongoTest
  });

  // Start the server.
  await server.start();

  console.log("SERVER LISTENING ON PORT: ", process.env.PORT || "5001", "FOR SERVER URL ", process.env.SERVER_URL)

  // Periodically clear cool-down tracking to prevent unbounded growth due to
  // per-session logged-out user tokens.
  setInterval(() => {
    userCooldowns = {};
  }, userCooldownClearIntervalMs);
})();
