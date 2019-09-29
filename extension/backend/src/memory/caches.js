// Server cooldowns to handle rate limiting (not viewer wait cooldown like abo e)
const channelRateLimitCooldown = {}; // rate limit compliance
const ROOM_URL = process.env.SERVER_URL ? process.env.SERVER_URL : `https://localhost:${process.env.PORT || "5000"}`
const LIVE_STREAMER_SOCKETS = {}

const findIsOnline = (channelId) => {
  const isOnline = Object.values(LIVE_STREAMER_SOCKETS).find((obj) => {
    return obj.channelId === channelId
  })
  return !!isOnline;
}

module.exports = {
  ROOM_URL,
  channelRateLimitCooldown,
  LIVE_STREAMER_SOCKETS,
  findIsOnline
}
