const jwt = require("jsonwebtoken");
import {
  makePostGlobalBitCost,
  makePostAudioUrlPlay,
  makePostChatEnabled,
  makePostGlobalCooldownTime,
  makePostGlobalMpaaRating,
  makePostTwitchSetting,
  makePostBoardSettings,
  makePostBlastPrice,
  makeGetTransactions,
  makeGetChannelSettingsAll,
  makePostRefreshRoom,
  makePostAudioUrlTest,
  makePostChannelVolume,
  makePostPartyAction
} from "../../networking";
import 'isomorphic-fetch'

/**
 * Helper class for authentication against an EBS service. Allows the storage of a token to be accessed across componenents.
 * This is not meant to be a source of truth. Use only for presentational purposes.
 */
export default class Authentication {
  constructor(token, opaque_id) {
    this.state = {
      token,
      opaque_id,
      user_id: false,
      isMod: false,
      role: ""
    };
  }

  isLoggedIn() {
    return this.state.opaque_id[0] === "U" ? true : false;
  }

  // This does guarantee the user is a moderator- this is fairly simple to bypass - so pass the JWT and verify
  // server-side that this is true. This, however, allows you to render client-side UI for users without holding on a backend to verify the JWT.
  // Additionally, this will only show if the user shared their ID, otherwise it will return false.
  isModerator() {
    return this.state.isMod;
  }

  // similar to mod status, this isn't always verifiable, so have your backend verify before proceeding.
  hasSharedId() {
    return !!this.state.user_id;
  }

  getUserId() {
    return this.state.user_id;
  }

  getOpaqueId() {
    return this.state.opaque_id;
  }

  // set the token in the Authentication componenent state
  // this is naive, and will work with whatever token is returned. under no circumstances should you use this logic to trust private data- you should always verify the token on the backend before displaying that data.
  setToken(token, opaque_id) {
    let isMod = false;
    let role = "";
    let user_id = "";

    try {
      let decoded = jwt.decode(token);

      if (decoded.role === "broadcaster" || decoded.role === "moderator") {
        isMod = true;
      }

      user_id = decoded.user_id;
      role = decoded.role;
    } catch (e) {
      token = "";
      opaque_id = "";
    }

    this.state = {
      token,
      opaque_id,
      isMod,
      user_id,
      role
    };
  }

  // checks to ensure there is a valid token in the state
  isAuthenticated() {
    if (this.state.token && this.state.opaque_id) {
      return true;
    } else {
      return false;
    }
  }

  async getTwitchChannelSettings() {
    const response = await makeGetChannelSettingsAll({
      bearerToken: this.state.token
    });
    return JSON.parse(response.body)
  }

  async postTwitchChannelSettings({ walkOnSetting }) {
    return makePostTwitchSetting({
      walkOnSetting,
      bearerToken: this.state.token
    });
  }

  async postGlobalMpaaRating(mpaaRating) {
    return makePostGlobalMpaaRating({
      mpaaRating,
      bearerToken: this.state.token
    });
  }

  async postRoomRefresh() {
    return makePostRefreshRoom({
      bearerToken: this.state.token
    });
  }

  async postGlobalCooldownTime(channelCooldown) {
    return makePostGlobalCooldownTime({
      channelCooldown,
      bearerToken: this.state.token
    });
  }

  async postBoardSettings({ selectedBoardIds, specificBoardEnabled }) {
    return makePostBoardSettings({
      selectedBoardIds,
      specificBoardEnabled,
      bearerToken: this.state.token
    });
  }

  async postPartyAction({ blastBites, roomId, transactionObj }) {
    return makePostPartyAction({
      blastBites,
      roomId,
      transactionObj,
      bearerToken: this.state.token
    });
  }

  async postGlobalBitCost(bitCost) {
    return makePostGlobalBitCost({
      bitCost,
      bearerToken: this.state.token
    });
  }
  
  async postBlastPrice(blastPrice) {
    return makePostBlastPrice({
      blastPrice,
      bearerToken: this.state.token
    });
  }

  async postIsChatEnabled({ isChatEnabled }) {
    return makePostChatEnabled({
      isChatEnabled,
      bearerToken: this.state.token
    });
  }
  async postChannelVolume({ volume }) {
    return makePostChannelVolume({
      volume,
      bearerToken: this.state.token
    });
  }

  async postAudioUrlPlay({ audioUrl, imageUrl, biteId, transactionObj, biteTitle, roomId }) {
    return makePostAudioUrlPlay({
      audioUrl,
      imageUrl,
      biteId,
      transactionObj,
      biteTitle,
      bearerToken: this.state.token,
      roomId
    });
  }

  async postAudioUrlTest({roomId}) {
    return makePostAudioUrlTest({
      roomId,
      bearerToken: this.state.token
    });
  }

  async getGlobalTransactions(limit) {
    const transactionsResponse = await makeGetTransactions({
      bearerToken: this.state.token,
      limit
    });

    return transactionsResponse ? JSON.parse(transactionsResponse.body) : [];
  }

  /**
     * Makes a call against a given endpoint using a specific method.
     *
     * Returns a Promise with the Request() object per fetch documentation.
     *
     */

  makeCall(url, method = "GET") {
    return new Promise((resolve, reject) => {
      if (this.isAuthenticated()) {
        let headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.state.token}`
        };

        fetch(url, {
          method,
          headers
        })
          .then(response => resolve(response))
          .catch(e => reject(e));
      } else {
        reject("Unauthorized");
      }
    });
  }
}
