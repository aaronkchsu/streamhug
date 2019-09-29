/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import gql from "graphql-tag";
import React from "react";
import { compose, graphql } from "react-apollo";
import styled from "styled-components";
import VerticalList from "../components/VerticalList";
import Header from "../components/HeaderWrapper";
import LoadingFullScreen from "../components/LoadingFullScreen";
import HomeButtonWrapper from "../components/HomeButtonWrapper";

const Container = styled.div``;

const LoadingContainer = styled.div`
  position: relative;
  font-weight: 300;
  width: 100%;
  min-height: 100vh;
  margin-bottom: 400px;

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
    updateQuery: (previousResult, { fetchMoreResult }) => {
      // Don't do anything if there weren't any new items
      if (
        previousResult.twitch &&
        !previousResult.twitch.playlistBitesPagination.pageInfo.hasNextPage
      ) {
        // TODO: set finished loading all blerps logo
        return previousResult;
      }

      if (
        !fetchMoreResult ||
        fetchMoreResult.twitch.playlistBitesPagination.items.length === 0
      ) {
        return previousResult;
      }

      return {
        // Concatenate the new search results after the old ones
        twitch: {
          ...fetchMoreResult.twitch,
          playlistBitesPagination: {
            ...fetchMoreResult.twitch.playlistBitesPagination,
            pageInfo: {
              ...fetchMoreResult.twitch.playlistBitesPagination.pageInfo
            },
            items: previousResult.twitch.playlistBitesPagination.items.concat(
              fetchMoreResult.twitch.playlistBitesPagination.items
            )
          }
        }
      };
    },
    variables: {
      pageNumber:
        dataProp.twitch.playlistBitesPagination.pageInfo.currentPage + 1
    }
  });
};

class Page extends React.Component {
  render() {
    if (this.props.data.error) {
      return <ErrorScreenContainer />;
    } else if (
      this.props.data.networkStatus === 1 ||
      this.props.data.networkStatus === 2
    ) {
      return (
        <LoadingContainer>
          <LoadingFullScreen />
        </LoadingContainer>
      );
    }

    return (
      <Container>
        <Header
          headerText={this.props.data.twitch.playlistById.title}
          showUserDonate={this.props.showUserDonate}
          user={this.props.user}
          isOverlay={this.props.isOverlay}
          isConfig={this.props.isConfig}
          onlyBoardsAllowed={this.props.onlyBoardsAllowed}
          blastPrice={this.props.blastPrice}
          subscriptionStatus={this.props.subscriptionStatus}
          onSubscribeClick={this.props.onSubscribeClick}
          openBlastTutorial={this.props.openBlastTutorial}
          isBlastEditing={this.props.isBlastEditing}
          selectedBlastBites={this.props.selectedBlastBites}
          subscriptionAllowed={this.props.subscriptionAllowed}
          isLoggedIn={this.props.isLoggedIn}
        />
        <HomeButtonWrapper />
        <VerticalList
          listLoadMore={handleListLoadMore(
            this.props.data,
            this.props.data.networkStatus,
            this.props.data.fetchMore
          )}
          prefetchLink={true}
          bites={
            this.props.data &&
            this.props.data.twitch.playlistBitesPagination.items
          }
          loggedIn={this.props.isLoggedIn}
          isEditingBlerpBlast={this.props.isEditingBlerpBlast}
          subscriptionStatus={this.props.subscriptionStatus}
          isOnline={this.props.isOnline}
        />
      </Container>
    );
  }
}

const fetchPlaylistQuery = gql`
  query twitchGetPlaylist($id: MongoID!, $pageNumber: Int!, $perPage: Int!) {
    twitch {
      playlistById(_id: $id) {
        title
      }
      playlistBitesPagination(_id: $id, page: $pageNumber, perPage: $perPage) {
        pageInfo {
          itemCount
          pageCount
          perPage
          hasNextPage
          currentPage
          itemCount
        }
        items {
          _id
          title
          keywords
          color
          image {
            original {
              url
            }
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
      }
    }
  }
`;

const fetchPlaylistWrap = graphql(fetchPlaylistQuery, {
  options: props => ({
    ssr: true,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    variables: {
      id: props.id,
      pageNumber: 0,
      perPage: 40
    }
  })
});

export default compose(fetchPlaylistWrap)(Page);
