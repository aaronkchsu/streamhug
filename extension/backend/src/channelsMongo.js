const request = require("request");
const mongoose = require("mongoose");
const fs = require("fs");
const { TwitchChannelModel } = require("./models/twitchChannel");
const options = {
  socketTimeoutMS: 45000,
  keepAlive: true,
  keepAliveInitialDelay: 300000,
  reconnectTries: 30000,
  useNewUrlParser: true
};

const dbName = process.env.MONGO_DB_NAME || "twitchebs";

const mongodbUrl = `mongodb://${process.env.MONGO_HOST || "localhost"}:27017/${dbName}`;

mongoose.Promise = global.Promise;
mongoose.connect(mongodbUrl, options);

async function getChannelIds() {
  return new Promise(async (resolve, reject) => {
    const channels = await TwitchChannelModel.find({})
    const channelsList = channels.map((channel) => {
      return channel._doc
    })
    resolve(channelsList)
    // resolve(JSON.parse(res.body))
  })
}

getChannelIds().then((channels) => {
  // const channelIds = channelIdList.join(",")
  // curl -H 'Accept: application/vnd.twitchtv.v5+json' \
  // -H 'Client-ID: oafn7vvzfyzyccwrwrt233221oe5wq' \
  // -X GET 'https://api.twitch.tv/kraken/channels/104790620'
  //   curl -H 'Accept: application/vnd.twitchtv.v5+json' \
  // -H 'Client-ID: oafn7vvzfyzyccwrwrt233221oe5wq' \
  // -X GET https://api.twitch.tv/kraken/users?login=schnabels_
  const allObjects = channels.map(async (channel) => {
      const twitchObject = await getChannelObjects(channel.channelId)
      return {
        twitchObject,
        ...channel
      }
  })

  Promise.all(allObjects).then(values => {
    fs.writeFile("./twitchUsers.json", JSON.stringify(values, null, 4), (err) => {
      if (err) {
          console.error(err);
          return;
      };
      console.log("File has been created");
     });
  })
})

async function getChannelObjects(id) {
    // Set the HTTP headers required by the Twitch API.
    const headers = {
      "Client-ID": "oafn7vvzfyzyccwrwrt233221oe5wq",
      "Accept": "application/vnd.twitchtv.v5+json"
    };

    return new Promise((resolve, reject) => {
        request(
            `https://api.twitch.tv/kraken/channels/${id}`,
            {
              method: "GET",
              headers
            },
            (err, res) => {
                // console.log("URL:", JSON.parse(res.body).url)
                resolve({url: JSON.parse(res.body).url, id: JSON.parse(res.body)._id})
            }
          );
    })
  }
