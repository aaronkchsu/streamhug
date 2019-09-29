const mongoose = require("mongoose");
const findOrCreate = require("findorcreate-promise");
const ObjectID = require('mongodb').ObjectID;

var TwitchChannelSchema = new mongoose.Schema(
  {
    channelId: {
      type: String,
      required: true,
      index: true,
      unique: true,
      description: "The twitch id of a twitch channel."
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      unique: true,
      auto: true,
      description: "The id used to broad audio clips to this channel."
    },
    mpaaRating: {
      type: String,
      enum: ["G", "PG", "PG13", "R", "NC17", "UR"],
      default: "PG",
      description: "MPAA Ratings standards for sound bites."
    },
    walkOnSetting: {
      type: String,
      enum: ["OFF", "1000", "2000", "3000"],
      default: "1000",
      description: "The bottom tier allowed to create and play subscriber walk on features"
    },
    channelCooldown: {
      type: Number,
      description: "The cooldown required after a viewer plays a blerp.",
      default: 30
    },
    globalBitCost: {
      type: Number,
      description: "The cost required to play a blerp in a channel stream.",
      default: 15
    },
    blastPrice: {
      type: Number,
      description: "The cost required to play a blerp in a channel stream.",
      default: 50
    },
    isChatEnabled: {
      type: Boolean,
      description: "If true this means the streamer blerp will post to chat",
      default: true
    },
    isAcceptingSounds: {
      type: Boolean,
      description: "If true this means the streamer is accepting sound plays",
      default: true
    },
    volume: {
      type: Number,
      description: "Volume to play to the stream panel",
      default: 1.0
    },
    specificBoardEnabled: {
      type: Boolean,
      description:
        "The setting that determines whether the viewers only see a board.",
      default: false
    },
    selectedBoardIds: {
      type: [String],
      description: "The board ids of the boards to show to viewers",
      default: []
    },
    walkOnSubscriptionIds: {
      type: [ { type: mongoose.Schema.Types.ObjectId, ref: 'WalkOnSubscription' } ],
      default: [],
      description: 'List of all channel walk on subscriptions'
    }
  },
  {
    timestamps: true
  }
);

TwitchChannelSchema.plugin(findOrCreate);

TwitchChannelSchema.index({ createdAt: 1 });

TwitchChannelSchema.pre("save", async function(next) {
  if (!this.isNew) return next();
  return next();
});

TwitchChannelSchema.pre("remove", async function(next) {
  return next();
});

const TwitchChannelModel = mongoose.model("TwitchChannel", TwitchChannelSchema);

const addNewWalkOnSubscriptionIdToChannel = async (channelId, subscriptionId) => {
  return await TwitchChannelModel.updateOne({ channelId: channelId }, { $addToSet: { walkOnSubscriptionIds: ObjectID(subscriptionId) } });
};

const removeWalkOnSubscriptionIdToChannel = async (channelId, subscriptionId) => {
  return await TwitchChannelModel.updateOne({ channelId: channelId }, { $pull: { walkOnSubscriptionIds: ObjectID(subscriptionId) } });
};

const setChannelBoardItems = async (
  channelId,
  isSpecificBoardEnabled = null,
  currentSelectedBoardIds = null
) => {
  if (isSpecificBoardEnabled !== null && currentSelectedBoardIds !== null) {
    return await TwitchChannelModel.updateOne(
      { channelId: channelId },
      {
        $set: {
          selectedBoardIds: currentSelectedBoardIds,
          specificBoardEnabled: isSpecificBoardEnabled == "true"
        }
      },
      { upsert: true }
    );
  } else if (
    currentSelectedBoardIds !== null &&
    isSpecificBoardEnabled === null
  ) {
    return await TwitchChannelModel.updateOne(
      { channelId: channelId },
      { $set: { selectedBoardIds: currentSelectedBoardIds } },
      { upsert: true }
    );
  } else if (
    isSpecificBoardEnabled !== null &&
    currentSelectedBoardIds === null
  ) {
    return await TwitchChannelModel.updateOne(
      { channelId: channelId },
      { $set: { specificBoardEnabled: isSpecificBoardEnabled == "true" } },
      { upsert: true }
    );
  }
};

const setChannelIsChatEnabled = async (channelId, isChatEnabled) => {
  return await TwitchChannelModel.updateOne(
    { channelId: channelId },
    { $set: { isChatEnabled: isChatEnabled == "true" } },
    { upsert: true }
  );
};

const setChannelGlobalVolume = async (channelId, volume) => {
  return await TwitchChannelModel.updateOne(
    { channelId: channelId },
    { $set: { volume: volume } },
    { upsert: true }
  );
};

const setChannelGlobalBitCost = async (channelId, globalBitCost) => {
  return await TwitchChannelModel.updateOne(
    { channelId: channelId },
    { $set: { globalBitCost: globalBitCost } },
    { upsert: true }
  );
};

const setChannelBlastPrice = async (channelId, blastPrice) => {
  return await TwitchChannelModel.updateOne(
    { channelId: channelId },
    { $set: { blastPrice: blastPrice } },
    { upsert: true }
  );
};

const setChannelMpaaRating = async (channelId, mpaaRating) => {
  return await TwitchChannelModel.updateOne(
    { channelId: channelId },
    { $set: { mpaaRating: mpaaRating } },
    { upsert: true }
  );
};

const setChannelSubscriberWalkOnSetting = async (channelId, walkOnSetting) => {
  return await TwitchChannelModel.updateOne(
    { channelId: channelId },
    { $set: { walkOnSetting: walkOnSetting } },
    { upsert: true }
  );
};

const refreshChannelRoomId = async (channelId) => {
  return await TwitchChannelModel.updateOne(
    { channelId: channelId },
    { $set: { roomId: new ObjectID() } },
    { upsert: true }
  );
};

const setChannelChannelCooldown = async (channelId, channelCooldown) => {
  return await TwitchChannelModel.updateOne(
    { channelId: channelId },
    { $set: { channelCooldown: channelCooldown } },
    { upsert: true }
  );
};

const getTwitchChannelSettings = async channelId => {
  const twitchChannel = await findOrCreateDefaults(channelId);

  if (twitchChannel && !twitchChannel.result) {
    throw new Error("getTwitchChannelSettings: document not created or found");
  }

  return twitchChannel.result;
};

const getTwitchChannelSettingsByRoomIds = async roomIds => {
  const twitchChannels = await TwitchChannelModel.find(
    {'roomId' : {
      '$in': roomIds
    }}
  ).exec();

  return twitchChannels;
};

const createTwitchChannel = async channelDetails => {
  const channel = {
    channelId: channelDetails.channelId,
    mpaaRating: channelDetails.mpaaRating,
    channelCooldown: channelDetails.channelCooldown,
    globalBitCost: channelDetails.globalBitCost
  };

  return await TwitchChannelModel.Create(channel);
};

const findOrCreateWithDetails = async channelDetails => {
  const channel = {
    channelId: channelDetails.channelId,
    mpaaRating: channelDetails.mpaaRating,
    channelCooldown: channelDetails.channelCooldown,
    globalBitCost: channelDetails.globalBitCost
  };

  return await TwitchChannelModel.findOrCreate(
    { channelId: channelDetails.channelId },
    channel,
    { upsert: true }
  );
};

const findOrCreateDefaults = async channelId => {
  return await TwitchChannelModel.findOrCreate({ channelId: channelId }, { channelId: channelId }, { upsert: true });
};

module.exports = {
  addNewWalkOnSubscriptionIdToChannel,
  removeWalkOnSubscriptionIdToChannel,
  TwitchChannelModel,
  setChannelMpaaRating,
  setChannelSubscriberWalkOnSetting,
  setChannelGlobalBitCost,
  setChannelBlastPrice,
  setChannelChannelCooldown,
  setChannelBoardItems,
  setChannelGlobalVolume,
  setChannelIsChatEnabled,
  createTwitchChannel,
  findOrCreateWithDetails,
  findOrCreateDefaults,
  getTwitchChannelSettings,
  getTwitchChannelSettingsByRoomIds,
  refreshChannelRoomId
};
