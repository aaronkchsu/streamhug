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
import NoBlerpFoundPage from './ErrorScreen';
import LoadingFullScreen from './LoadingFullScreen';
import Boards from './Boards';
import { getArrayOfMpaaRatings } from '../other/mpaaRating';
import { darkText, bodyText } from '../other/colors';

const FETCH_SEARCH_QUERY = gql`
  query twitchSearchPage($query: String!, $pageCount: Int!, $perPage: Int!, $audienceRating: [AudienceRating]) {
    twitch {
      playlistElasticSearch(query: $query, page: 0, perPage: 30, audienceRating: $audienceRating) {
        pageInfo {
          perPage
          hasNextPage
          currentPage
          itemCount
        }
        items {
          _id
          title
          image {
            original {
              url
            }
          }
          giphy {
            embed
            gif
          }
        }
      }
      biteElasticSearch(query: $query, page: $pageCount, perPage: $perPage, audienceRating: $audienceRating) {
        pageInfo {
          perPage
          hasNextPage
          currentPage
          itemCount
        }
        bites {
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
            gif
          }
          favorited
          playCount
          audienceRating
          audio {
            mp3 {
              url
            }
          }
        }
      }
    }
  }
`;

const EmptyQueryContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  margin-bottom: 200px;
`;

const LoadingContainer = styled.div`
  position: relative;
  font-weight: 300;
  width: 100%;
  min-height: 100vh;
  margin-bottom: 200px;
  padding: 0;
  margin: 0;
`;

const DescriptionTitle = styled.p`
  color: ${bodyText};
  font-weight: bold;
  font-size: 16px;
  align-self: flex-start;
  text-decoration: none;
  margin: 8px;
`;

const handleListLoadMore = (dataProp, networkStatus, fetchMore) => () => {
  // I was using awaitMore={props.data.networkStatus === 3} before but for some reason it stops randomnly
  if (networkStatus === 3) {
    return;
  }
  // The fetchMore method is used to load new data and add it
  // to the original query we used to populate the list
  fetchMore({
    updateQuery: (previousResult, { fetchMoreResult }) => {
      // Don't do anything if there weren't any new items
      if (previousResult.twitch && !previousResult.twitch.biteElasticSearch.pageInfo.hasNextPage) {
        // TODO: set finished loading all blerps logo
        return previousResult;
      }
      if (
        !fetchMoreResult ||
        !fetchMoreResult.twitch.biteElasticSearch ||
        fetchMoreResult.twitch.biteElasticSearch.bites.length === 0
      ) {
        return previousResult;
      }

      return {
        // Concatenate the new search results after the old ones
        twitch: {
          ...fetchMoreResult.twitch,
          biteElasticSearch: {
            ...fetchMoreResult.twitch.biteElasticSearch,
            pageInfo: {
              ...fetchMoreResult.twitch.biteElasticSearch.pageInfo
            },
            bites: previousResult.twitch.biteElasticSearch.bites.concat(fetchMoreResult.twitch.biteElasticSearch.bites)
          }
        }
      };
    },
    variables: {
      pageCount: dataProp.twitch.biteElasticSearch.pageInfo.currentPage + 1
    }
  });
};

export default class SearchBitesWrapper extends React.Component {
  static defaultProps = {
    currentMpaaRating: [ 'G' ]
  };
  renderNoBlerpFound() {
    return (
      <EmptyQueryContainer>
        <NoBlerpFoundPage
          mainText="Oh No!"
          subtitle="We don't have that blerp!"
          onPinkButtonClick={this.handleCreateClick}
          redirectButtonText={'Create it Now'}
          searchQuery={this.props.searchQuery}
          loggedIn={this.props.loggedIn}
          currentMpaaRating={this.props.currentMpaaRating}
        />
      </EmptyQueryContainer>
    );
  }

  renderPlaylists(data) {
    if (!data || !data.twitch || !data.twitch.playlistElasticSearch) {
      return;
    }

    const boardSearchText =
      data.twitch.playlistElasticSearch.pageInfo.itemCount == '1'
        ? `${data.twitch.playlistElasticSearch.pageInfo.itemCount} board found`
        : `${data.twitch.playlistElasticSearch.pageInfo.itemCount} boards found`;

    return (
      <Boards
        playlists={data && data.twitch && data.twitch.playlistElasticSearch.items}
        title={boardSearchText}
        featuredPage={'SEARCH'}
      />
    );
  }

  render() {
    return (
      <Query
        query={FETCH_SEARCH_QUERY}
        fetchPolicy={'network-only'}
        variables={{
          query: this.props.searchQuery,
          pageCount: 0,
          perPage: 20,
          audienceRating: getArrayOfMpaaRatings(this.props.currentMpaaRating)
        }}
        notifyOnNetworkStatusChange={true}
      >
        {({ error, data, networkStatus, fetchMore }) => {
          if (this.props.searchQuery === '') {
            return <EmptyQueryContainer />;
          } else if (networkStatus === 1 || networkStatus === 2) {
            return (
              <LoadingContainer>
                <LoadingFullScreen />
              </LoadingContainer>
            );
          } else if (
            error ||
            !data ||
            !data.twitch ||
            !data.twitch.biteElasticSearch ||
            !data.twitch.biteElasticSearch.bites.length
          ) {
            return this.renderNoBlerpFound();
          }

          return (
            <div>
              {this.renderPlaylists(data)}
              {data &&
              data.twitch &&
              data.twitch.biteElasticSearch &&
              data.twitch.biteElasticSearch.pageInfo &&
              data.twitch.biteElasticSearch.pageInfo.itemCount && (
                <DescriptionTitle>
                  {data.twitch.biteElasticSearch.pageInfo.itemCount == '1' ? (
                    `${data.twitch.biteElasticSearch.pageInfo.itemCount} result for ${this.props.searchQuery}`
                  ) : (
                    `${data.twitch.biteElasticSearch.pageInfo.itemCount} results for ${this.props.searchQuery}`
                  )}
                </DescriptionTitle>
              )}
              <VerticalList
                listLoadMore={handleListLoadMore(data, networkStatus, fetchMore)}
                prefetchLink={true}
                bites={data.twitch && data.twitch.biteElasticSearch && data.twitch.biteElasticSearch.bites}
                loggedIn={this.props.loggedIn}
                isEditingBlerpBlast={this.props.isEditingBlerpBlast}
                subscriptionStatus={this.props.subscriptionStatus}
                isOnline={this.props.isOnline}
              />
            </div>
          );
        }}
      </Query>
    );
  }
}
