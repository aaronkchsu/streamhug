/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import gql from 'graphql-tag';

import { setGlobalAudioPlayerMute, setGlobalAudioPlayerVolume } from '../other/globalAudioPlayer';

const isBrowser = typeof window !== 'undefined';

const createResolvers = (opts) => {
  let resolvers = {};

  resolvers = {
    Mutation: {
      setGlobalVolume: (_, { volume }, { cache }) => {
        setGlobalAudioPlayerVolume(volume);
        cache.writeData({ data: { globalVolume: volume } });
        return null;
      },
      setBoardSettings: (_, { selectedBoardIds, specificBoardEnabled }, { cache }) => {
        if (selectedBoardIds !== null && specificBoardEnabled !== null) {
          cache.writeData({
            data: {
              selectedBoardIds: selectedBoardIds,
              specificBoardEnabled: specificBoardEnabled === 'false' || specificBoardEnabled === false ? false : true
            }
          });
        } else if (selectedBoardIds !== null) {
          cache.writeData({
            data: {
              selectedBoardIds: selectedBoardIds
            }
          });
        } else if (specificBoardEnabled !== null) {
          cache.writeData({
            data: {
              specificBoardEnabled: specificBoardEnabled === 'false' || specificBoardEnabled === false ? false : true
            }
          });
        }
        return null;
      },
      setGlobalSrc: (_, { id }, { cache }) => {
        cache.writeData({ data: { globalSrcId: id } });
        return null;
      },
      removeBlastedBiteByIndex: (_, { index }, { cache }) => {
        const { selectedBlastBites } = cache.readQuery({
          query: gql`
            query readSelectedBites {
              selectedBlastBites {
                id
                title
                audioUrl
                imageUrl
              }
            }
          `
        });

        // Remove an alement and rotate in a null value
        selectedBlastBites.splice(index, 1);
        selectedBlastBites.push(null);

        cache.writeData({ data: { selectedBlastBitesFull: false } });

        const query = gql`
          query twitchWriteGlobalSend {
            selectedBlastBites {
              __typename
              id
              title
              audioUrl
              imageUrl
            }
          }
        `;

        cache.writeData({
          query,
          data: {
            selectedBlastBites: selectedBlastBites
          }
        });
        return null;
      },
      clearSelectedBlastBites: (_, { clear }, { cache }) => {
        const { selectedBlastBites } = cache.readQuery({
          query: gql`
            query readSelectedBites {
              selectedBlastBites {
                id
                title
                audioUrl
                imageUrl
              }
            }
          `
        });

        if (clear) {
          selectedBlastBites[0] = null;
          selectedBlastBites[1] = null;
          selectedBlastBites[2] = null;
          selectedBlastBites[3] = null;
          selectedBlastBites[4] = null;
        }
        
        const query = gql`
          query twitchWriteGlobalSend {
            selectedBlastBites {
              __typename
              id
              title
              audioUrl
              imageUrl
            }
          }
        `;

        cache.writeData({
          query,
          data: {
            selectedBlastBites: selectedBlastBites,
            selectedBlastBitesFull: false
          }
        });
        return null;
      },
      selectBlastedBite: (_, { bite, maxSelectionNumber }, { cache }) => {
        const { selectedBlastBites } = cache.readQuery({
          query: gql`
            query readSelectedBites {
              selectedBlastBites {
                id
                title
                audioUrl
                imageUrl
              }
            }
          `
        });

        let index = selectedBlastBites.findIndex((element) => element === null);

        // maxSelectionNumber is the maximun number of bites the user is allowed to send
        if (index === -1 || index > maxSelectionNumber - 1) {
          index = maxSelectionNumber - 1;
          return null; // NOTE: do nothing if the queue is full
        }

        if (index === maxSelectionNumber - 1) {
          cache.writeData({ data: { selectedBlastBitesFull: true } });
        }

        selectedBlastBites[index] = { __typename: 'BlastBite', ...bite };

        const query = gql`
          query twitchWriteGlobalSend {
            selectedBlastBites {
              __typename
              id
              title
              audioUrl
              imageUrl
            }
          }
        `;

        cache.writeData({
          query,
          data: {
            selectedBlastBites: selectedBlastBites
          }
        });

        return null;
      },
      setGlobalBitCost: (_, { bitCost }, { cache }) => {
        cache.writeData({ data: { globalBitCost: Number(bitCost) } });
        return null;
      },
      setGlobalVolumeIsMuted: (_, { muted }, { cache }) => {
        setGlobalAudioPlayerMute(muted);
        cache.writeData({ data: { globalVolumeIsMuted: muted } });
        return null;
      },
      setSidebarMenuState: (_, { willOpen }, { cache }) => {
        cache.writeData({ data: { isSideBarMenuOpen: willOpen } });
        return null;
      },
      setGlobalScreen: (_, { screen, id, searchQuery }, { cache }) => {
        if (searchQuery) {
          cache.writeData({
            data: {
              globalScreen: screen,
              globalBoardId: '',
              globalSearchQuery: searchQuery ? searchQuery : ''
            }
          });
        } else {
          cache.writeData({
            data: {
              globalScreen: screen,
              globalBoardId: id || '',
              globalSearchQuery: ''
            }
          });
        }
        return null;
      },
      setGlobalSearchQuery: (_, { query }, { cache }) => {
        cache.writeData({ data: { globalSearchQuery: query } });
        return null;
      },
      setGlobalShowBite: (_, { show, biteToSend }, { cache, getCacheKey }) => {
        const showBite = biteToSend
          ? {
              id: biteToSend.id,
              audioUrl: biteToSend.audioUrl,
              imageUrl: biteToSend.imageUrl,
              bitCount: biteToSend.bitCount,
              title: biteToSend.title,
              __typename: 'GlobalSendBite'
            }
          : null;

        cache.writeData({
          data: {
            showGlobalSendBite: show
          }
        });

        const query = gql`
          query twitchWriteGlobalSend {
            globalSendBite {
              id
              title
              audioUrl
              bitCount
              imageUrl
            }
          }
        `;

        cache.writeQuery({
          query,
          data: {
            globalSendBite: showBite
          }
        });
        return null;
      },
      showBlerpShareScreen: (_, { show }, { cache, getCacheKey }) => {
        cache.writeData({
          data: {
            showBlastShareScreen: show
          }
        });
        return null;
      },
      setGlobalCooldownActive: (_, { active }, { cache, getCacheKey }) => {
        cache.writeData({ data: { globalCooldownActive: active } });
        return null;
      },
      setCurrentCoundownTime: (_, { time, set }, { cache, getCacheKey }) => {
        if(set) {
          cache.writeData({ data: { currentCountdownTime: time } });
          return null;
        } else {
          const { currentCountdownTime } = cache.readQuery({
            query: gql`
              query readTime {
                currentCountdownTime
              }
            `
          });
          cache.writeData({ data: { currentCountdownTime: currentCountdownTime - 1 } });
          return null;
        }
      },
      coundownTimeDecrement: (_, { }, { cache, getCacheKey }) => {
       
      },
      setBlastEdit: (_, { show }, { cache, getCacheKey }) => {
        cache.writeData({ data: { isBlastEditing: show } });
        return null;
      },
      setGlobalCooldownTime: (_, { time }, { cache, getCacheKey }) => {
        cache.writeData({ data: { globalCooldownTime: time } });
        return null;
      },
      setGlobalMpaaRating: (_, { rating }, { cache, getCacheKey }) => {
        cache.writeData({ data: { globalMpaaRating: rating } });
        return null;
      },
      setTwitchChannelSettings: (_, { twitchChannelSettings }, { cache, getCacheKey }) => {
        const twitchChannelSettingsFiltered = {
          roomId: twitchChannelSettings.roomId,
          audioBroadcastUrl: twitchChannelSettings.audioBroadcastUrl,
          globalBitCost: twitchChannelSettings.globalBitCost,
          channelCooldown: twitchChannelSettings.channelCooldown,
          mpaaRating: twitchChannelSettings.mpaaRating,
          specificBoardEnabled: twitchChannelSettings.specificBoardEnabled,
          globalBroadcastVolume: twitchChannelSettings.volume,
          selectedBoardIds: twitchChannelSettings.selectedBoardIds,
          isOnline: twitchChannelSettings.isOnline,
          blastPrice: twitchChannelSettings.blastPrice,
          __typename: 'TwitchChannelSettings'
        };

        const query = gql`
          query twitchWriteTwitchSettings {
            twitchChannelSettings {
              globalBitCost
              channelCooldown
              mpaaRating
              specificBoardEnabled
              selectedBoardIds
              audioBroadcastUrl
              roomId
              globalBroadcastVolume
              isOnline
              blastPrice
            }
            globalBitCost
            globalMpaaRating
            globalCooldownTime
            globalBroadcastVolume
            specificBoardEnabled
            selectedBoardIds
          }
        `;

        const oldItems = {
          globalBitCost: twitchChannelSettingsFiltered.globalBitCost,
          globalMpaaRating: twitchChannelSettingsFiltered.mpaaRating,
          globalCooldownTime: twitchChannelSettingsFiltered.channelCooldown,
          specificBoardEnabled: twitchChannelSettingsFiltered.specificBoardEnabled,
          selectedBoardIds: twitchChannelSettingsFiltered.selectedBoardIds,
          globalBroadcastVolume: twitchChannelSettingsFiltered.globalBroadcastVolume
        };

        cache.writeQuery({
          query,
          data: {
            twitchChannelSettings: twitchChannelSettingsFiltered,
            ...oldItems
          }
        });
        return null;
      }
    }
  };

  return resolvers;
};

export default createResolvers;
