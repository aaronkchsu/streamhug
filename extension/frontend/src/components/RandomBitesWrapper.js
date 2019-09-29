/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */
import * as React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import VerticalList from './VerticalList';
import LoadingFullScreen from './LoadingFullScreen';
import { getArrayOfMpaaRatings } from '../other/mpaaRating';

import Boards from './Boards';

import { darkText, bodyText } from '../other/colors';

const DescriptionTitle = styled.p`
  color: ${bodyText};
  font-weight: bold;
  font-size: 16px;
  align-self: flex-start;
  text-decoration: none;
  margin: 8px;
`;

const FETCH_RANDOM_QUERY = gql`
  query twitchRandomPage($audienceRating: [AudienceRating]) {
    twitch {
      biteRandomMany(limit: 40, audienceRating: $audienceRating) {
        ...indexBite
      }
      getFeaturedListForPlatform {
        _id
        title
        playlistObjects {
          _id
          title
          biteIds
          image {
            original {
              url
            }
          }
          giphy {
            gif
          }
        }
      }
    }
  }

  fragment indexBite on Bite {
    _id
    title
    keywords
    color
    image {
      original {
        url
      }
    }
    giphy {
      embed
    }
    favorited
    playCount
    audienceRating
    audio {
      original {
        url
      }
      mp3 {
        url
      }
    }
  }
`;

const LoadingContainer = styled.div`
  position: relative;
  font-weight: 300;
  width: 100%;
  height: 70%;

  @media (max-width: 600px) {
    padding: 0;
    margin: 0;
  }
`;

const handleListLoadMore = (dataProp, networkStatus, fetchMore) => () => {
  // I was using awaitMore={props.data.networkStatus === 3} before but for some reason it stops randomnly
  if (networkStatus === 3) {
    return;
  }
  // The fetchMore method is used to load new data and add it
  // to the original query we used to populate the list
  fetchMore({
    updateQuery: (previousData, { fetchMoreResult }) => {
      // Don't do anything if there weren't any new items
      if (
        !fetchMoreResult.twitch ||
        !fetchMoreResult.twitch.biteRandomMany ||
        fetchMoreResult.twitch.biteRandomMany.length === 0
      ) {
        return previousData;
      }

      return {
        twitch: {
          ...previousData.twitch,
          biteRandomMany: previousData.twitch.biteRandomMany.concat(fetchMoreResult.twitch.biteRandomMany)
        }
      };
    }
  });
};

export default class RandomBitesWrapper extends React.Component {
  static defaultProps = {
    currentMpaaRating: [ 'G' ]
  };
  renderNoBlerpFound() {
    // TODO: do a noblerpfound screen that isn't recursive
    return (
      // <NoBlerpFoundPage
      //   mainText="Oh No!"
      //   subtitle="We don't have that blerp!"
      //   onPinkButtonClick={this.handleCreateClick}
      //   redirectButtonText={"Create it Now"}
      // />
      <div />
    );
  }

  renderPlaylists(data) {
    if (!data || !data.twitch || !data.twitch.getFeaturedListForPlatform) {
      return;
    }

    return (
      <Boards
        playlists={data && data.twitch && data.twitch.getFeaturedListForPlatform.playlistObjects}
        title={`Featured Soundboards`}
        featuredPage={'HOME'}
      />
    );
  }

  render() {
    return (
      <Query
        query={FETCH_RANDOM_QUERY}
        errorPolicy={'all'}
        variables={{
          audienceRating: getArrayOfMpaaRatings(this.props.currentMpaaRating)
        }}
        fetchPolicy={'network-only'}
        notifyOnNetworkStatusChange={true}
      >
        {({ loading, error, data, networkStatus, fetchMore }) => {
          if (networkStatus === 1 || networkStatus === 2) {
            return (
              <LoadingContainer>
                <LoadingFullScreen />
              </LoadingContainer>
            );
          } else if (!data || !data.twitch || !data.twitch.biteRandomMany || error) {
            return this.renderNoBlerpFound();
          }

          return (
            <React.Fragment>
              {this.renderPlaylists(data)}
              <DescriptionTitle>{'Popular Blerps'}</DescriptionTitle>
              <VerticalList
                listLoadMore={handleListLoadMore(data, networkStatus, fetchMore)}
                prefetchLink={true}
                bites={data.twitch && data.twitch.biteRandomMany}
                loggedIn={this.props.loggedIn}
                isEditingBlerpBlast={this.props.isEditingBlerpBlast}
                subscriptionStatus={this.props.subscriptionStatus}
                isOnline={this.props.isOnline}
              />
            </React.Fragment>
          );
        }}
      </Query>
    );
  }
}
