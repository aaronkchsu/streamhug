const mongoose = require('mongoose');
const findOrCreate = require('findorcreate-promise');
const ObjectID = require('mongodb').ObjectID;

let TwitchViewerSchema = new mongoose.Schema(
  {
    viewerId: {
      type: String,
      required: true,
      index: true,
      unique: true,
      description: 'The viewer the twitch channel.'
    },
    walkOnSubscriptionIds: {
      type: [ { type: mongoose.Schema.Types.ObjectId, ref: 'WalkOnSubscription' } ],
      default: [],
      description: 'List of all viewer subscriptions'
    }
  },
  {
    timestamps: true
  }
);

TwitchViewerSchema.plugin(findOrCreate);

TwitchViewerSchema.index({ createdAt: 1 });

TwitchViewerSchema.pre('save', async function(next) {
  if (!this.isNew) return next();
  return next();
});

TwitchViewerSchema.pre('remove', async function(next) {
  return next();
});

const TwitchViewerModel = mongoose.model('TwitchViewer', TwitchViewerSchema);

const addNewWalkOnSubscriptionIdToViewer = async (viewerId, subscriptionId) => {
  return await TwitchViewerModel.updateOne({ viewerId: viewerId }, { $addToSet: { walkOnSubscriptionIds: ObjectID(subscriptionId) } });
};

const removeWalkOnSubscriptionIdToViewer = async (viewerId, subscriptionId) => {
  return await TwitchViewerModel.updateOne({ viewerId: viewerId }, { $pull: { walkOnSubscriptionIds: ObjectID(subscriptionId) } });
};

const getTwitchViewer = async (viewerId) => {
  const twitchViewer = await findOrCreateDefaults(viewerId);

  if (twitchViewer && !twitchViewer.result) {
    throw new Error('getTwitchViewerSettings: document not created or found');
  }

  return twitchViewer.result;
};

const findOrCreateDefaults = async (viewerId) => {
  return await TwitchViewerModel.findOrCreate({ viewerId: viewerId }, { viewerId: viewerId }, { upsert: true });
};

module.exports = {
  addNewWalkOnSubscriptionIdToViewer,
  removeWalkOnSubscriptionIdToViewer,
  TwitchViewerModel,
  getTwitchViewer
};
