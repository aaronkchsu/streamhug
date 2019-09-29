const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      description: "The transaction Id of a played blerp transaction."
    },
    transactionDetails: {
      type: {},
      description: "Extra information about transaction.",
      select: false
    },
    blastBites: {
      type: {},
      description: "Selected Bites in a Blerp Blast",
      select: false
    },
    blastPrice: {
      type: String,
      description:
        "The current blast price of the channel when blerp transaction was made."
    },
    userName: {
      type: String,
      description: "The name of user who donated bits"
    },
    channelId: {
      type: String,
      index: true,
      description: "The id of a twitch channel which initiated the transaction."
    },
    biteId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      description: "The id of the bite that was played."
    },
    biteTitle: {
      type: String,
      description: "The title of the bite that was played."
    },
    audioUrl: {
      type: String,
      description: "The audioUrl of the bite that was played."
    },
    currentChannelBitCost: {
      type: String,
      description:
        "The current bitcost of the channel when blerp transaction was made."
    }
  },
  {
    timestamps: true
  }
);

TransactionSchema.index({ createdAt: 1 });

TransactionSchema.pre("save", async function(next) {
  if (!this.isNew) return next();
  return next();
});

TransactionSchema.pre("remove", async function(next) {
  return next();
});

const TransactionModel = mongoose.model("Transaction", TransactionSchema);

const findTransactionsByChannelId = async ({ channelId, limit }) => {
  const upperBarrierLimit = Number(limit) > 100 ? 100 : limit;
  const lowerBarrierLimit =
    Number(upperBarrierLimit) < 0 ? 0 : upperBarrierLimit;
  const transaction = await TransactionModel.find(
    {
      channelId: channelId
    },
    { transactionDetails: 0 }
  )
    .sort({ createdAt: -1 })
    .limit(lowerBarrierLimit)
    .exec();
  return transaction;
};

const findTransactionsByChannelIdAndDate = async ({ channelId, limit, date }) => {
  const upperBarrierLimit = Number(limit) > 100000000 ? 100000000 : limit;
  const lowerBarrierLimit =
    Number(upperBarrierLimit) < 0 ? 0 : upperBarrierLimit;
  const transaction = await TransactionModel.find(
    {
      "$and": [{ channelId: channelId }, { createdAt: { "$gte": date } }]
    },
    { transactionDetails: 0 }
  )
    .sort({ createdAt: -1 })
    .select('transactionDetails')
    .limit(lowerBarrierLimit)
    .exec();
  return transaction;
};

const createTransaction = async ({
  transactionDetails,
  biteId,
  biteTitle,
  audioUrl,
  currentChannelBitCost,
  channelId,
  blastPrice,
  blastBites
}) => {
  let transactionRecord = {
    transactionId: transactionDetails
      ? transactionDetails.transactionId
      : mongoose.Types.ObjectId(),
    userName: transactionDetails ? transactionDetails.displayName : "",
    transactionDetails,
    biteId,
    biteTitle,
    audioUrl,
    currentChannelBitCost,
    channelId,
    blastPrice,
    blastBites
  };

  // Create the transaction from the record
  const transaction = await TransactionModel.create(transactionRecord);

  return transaction;
};

module.exports = {
  TransactionSchema,
  createTransaction,
  findTransactionsByChannelId,
  findTransactionsByChannelIdAndDate
};
