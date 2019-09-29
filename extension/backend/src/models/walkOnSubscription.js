const mongoose = require("mongoose");
const findOrCreate = require("findorcreate-promise");
const ObjectID = require('mongodb').ObjectID;

var WalkOnSubscriptionSchema = new mongoose.Schema(
  {
    viewerId: {
      type: String,
      required: true,
      index: true,
      description: "The viewer the twitch channel."
    },
    channelId: {
      type: String,
      required: true,
      index: true,
      description: "The channel that the viewer is subscribed to"
    },
    lastPlayed: {
      type: Date,
      default: new Date(new Date() - 150 * 60000), // far enough back to be played again
      description: "The timestamp of the last time subscription was activated. (Used to ward against abuse)"
    },
    isEnabled: {
      type: Boolean,
      description: "If true this means the streamer blerp will post to chat",
      default: true
    },
    biteIds: {
      type: [String],
      index: true,
      description: "List of bites to be played on entrance (max three for now)",
    }
  },
  {
    timestamps: true
  }
);

WalkOnSubscriptionSchema.plugin(findOrCreate);

WalkOnSubscriptionSchema.index({ createdAt: 1 });

WalkOnSubscriptionSchema.pre("save", async function(next) {
  if (!this.isNew) return next();
  return next();
});

WalkOnSubscriptionSchema.pre("remove", async function(next) {
  return next();
});

const WalkOnSubscriptionModel = mongoose.model("WalkOnSubscription", WalkOnSubscriptionSchema);

const setWalkOnBiteIds = async ({walkOnId, biteIds}) => {
  return await WalkOnSubscriptionModel.updateOne(
    { _id: walkOnId },
    { $set: { biteIds: biteIds} },
    { upsert: true }
  );
};

const setWalkOnEnabled = async ({ walkOnId, isEnabled}) => {
  return await WalkOnSubscriptionModel.updateOne(
    { _id: walkOnId },
    { $set: { isEnabled: isEnabled } },
    { upsert: true }
  );
};

const setWalkOnLastPlayed = async ({ walkOnId }) => {
  return await WalkOnSubscriptionModel.updateOne(
    { _id: walkOnId },
    { $set: { lastPlayed: new Date() } },
    { upsert: true }
  );
};

const createWalkOnSubscription = async ({ viewerId, channelId, biteIds, isEnabled }) => {
  const channel = {
    viewerId: viewerId,
    lastPlayed: new Date(),
    channelId: channelId,
    biteIds: biteIds,
    isEnabled: isEnabled
  };

  return await WalkOnSubscriptionModel.Create(channel);
};

const getAllWalkOnSubscriptions = async allIds => {
  const walkOnSubscriptions = await WalkOnSubscriptionModel.find(
    {'_id' : {
      '$in': allIds
    }}
  ).exec();

  return walkOnSubscriptions;
};

// Find or create walk on subscription
const findOrCreateWalkOnSubscription = async ({ viewerId, channelId }) => {
  const walkOnSubscription = await findOrCreateDefaults({ viewerId, channelId });

  if (walkOnSubscription && !walkOnSubscription.result) {
    throw new Error("getwalkOnSubscriptionSettings: document not created or found");
  }

  // result is the actual data - .created tells weather it was a new item https://www.npmjs.com/package/findorcreate-promise
  return { result: walkOnSubscription.result, created: walkOnSubscription.created};
};

const findOrCreateDefaults = async ({ viewerId, channelId }) => {
  return await WalkOnSubscriptionModel.findOrCreate({ $and: [ { viewerId }, { channelId } ] }, { channelId: channelId, viewerId: viewerId }, { upsert: true });
};

module.exports = {
  WalkOnSubscriptionModel,
  createWalkOnSubscription,
  getAllWalkOnSubscriptions,
  setWalkOnBiteIds,
  setWalkOnEnabled,
  setWalkOnLastPlayed,
  findOrCreateWalkOnSubscription
};
