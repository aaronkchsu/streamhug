/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { ApolloLink } from "apollo-link";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { withClientState } from "apollo-link-state";

import createResolvers from "../data/resolvers";
import projectConfig from "../env";
import SCREENS from "../data/screens";
import 'isomorphic-fetch'

const isBrowser = typeof window !== "undefined";

const uri = projectConfig.apiEndpoint;

export const defaults = {
  globalSrcId: "",
  globalBoardId: "",
  globalScreen: SCREENS.popular,
  globalSearchQuery: "",
  showGlobalSendBite: false,
  globalSendBite: null,
  twitchChannelSettings: null,
  globalBitCost: 100,
  globalVolumeIsMuted: false,
  globalCooldownTime: 30,
  currentCountdownTime: 0,
  globalCooldownActive: true,
  globalMpaaRating: "G",
  specificBoardEnabled: false,
  selectedBoardIds: [],
  isBlastEditing: false,
  showBlastShareScreen: false,
  selectedBlastBites: [null, null, null, null, null],
  selectedBlastBitesFull: false,
  globalBroadcastVolume: 1.0,
  isSideBarMenuOpen: false
};

export const defaultsConfig = {
  globalSrcId: "",
  globalBoardId: "",
  globalScreen: SCREENS.config,
  globalSearchQuery: "",
  showGlobalSendBite: false,
  globalSendBite: null,
  twitchChannelSettings: null,
  globalBitCost: 100,
  globalVolumeIsMuted: false,
  globalCooldownTime: 30,
  currentCountdownTime: 0,
  globalCooldownActive: true,
  globalMpaaRating: "G",
  specificBoardEnabled: false,
  selectedBoardIds: [],
  isBlastEditing: false,
  showBlastShareScreen: false,
  selectedBlastBites: [null, null, null, null, null],
  selectedBlastBitesFull: false,
  globalBroadcastVolume: 1.0,
  isSideBarMenuOpen: false
};

let apolloClient = null;

const apolloCache = new InMemoryCache({
  dataIdFromObject: result => result.id || null
});

const stateLink = withClientState({ resolvers: createResolvers(), cache: apolloCache, defaults });

const stateLinkConfig = withClientState({
  resolvers: createResolvers(),
  cache: apolloCache,
  defaults: defaultsConfig
});

const httpLink = createHttpLink({
  uri
});

// const httpLink = createHttpLink({
//   uri,
//   headers: {
//     platform: "Twitch",
//     Authorization: `Bearer ${process.env.BLERP_TOKEN}`
//   }
// });

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = isBrowser
    ? window.localStorage ? window.localStorage.getItem("jwt") : ""
    : "";

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

function create(initialState, opts) {
  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    cache: apolloCache.restore(initialState),
    connectToDevTools: !!isBrowser,
    link: ApolloLink.from([
      opts.config ? stateLinkConfig : stateLink,
      authLink,
      httpLink
    ]),
    ssrMode: !isBrowser
  });
}

export const initClient = (initialState, opts) => {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!isBrowser) {
    return create(initialState, opts);
  }

  // Reuse client on the client-side or create one if it does not exist
  if (!apolloClient) {
    apolloClient = create(initialState, opts);
  }

  return apolloClient;
};
