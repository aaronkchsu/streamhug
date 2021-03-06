/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import * as React from "react";
import styled, { keyframes } from "styled-components";
import gql from "graphql-tag";
import { ChildProps, graphql, Query, Mutation } from "react-apollo";

import VerticalList from "../lists/VerticalList";
import PlusCheckButton from "../buttons/PlusCheckButton";
import TextInput from "../inputs/search-input";

import {
  actionBackground,
  primaryText,
  flyoutBackground,
  pandaPink,
  iconsInActive,
  pandaTeal,
  secondaryGray,
  defaultBackground
} from "../../other/colors";

const FETCH_SEARCH_QUERY = gql`
  query twitchSearchPage($query: String!, $pageCount: Int!, $perPage: Int!) {
    twitch {
      playlistElasticSearch(
        query: $query
        page: $pageCount
        perPage: $perPage
      ) {
        pageInfo {
          perPage
          hasNextPage
          currentPage
          itemCount
        }
        items {
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
`;

const InputRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  height: 60px;
  background-color: ${defaultBackground};

  &:hover {
    background-color: ${defaultBackground};
  }
`;

const StyledPlusCheckButton = styled(PlusCheckButton)`
  position: absolute;
  top: -4px;
  right: -4px;
`;

const ListContainer = styled.div`
  height: 180px;
  overflow-y: scroll;
  width: 100%;
`;

const BoardRowContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  height: 60px;
  background-color: transparent;

  &:hover {
    background-color: ${actionBackground};
  }
`;

const BoardSquareContainer = styled.div`
  position: relative;
  width: 48px;
  height: 48px;
  background-color: transparent;
  margin: 4px;

  &:hover {
    opacity: 0.8;
  }
`;

const BoardImage = styled.img`
  position: position;
  top: 0;
  left: 0;
  border-radius: 6px;
  width: 48px;
  height: 48px;
`;

const Scrim = styled.div`
  position: absolute;
  border-radius: 6px;
  width: 100%;
  height: 60px;
  top: 0;
  left: 0;
  background-color: ${pandaTeal};
  opacity: 0;
  z-index: 10;

  &:hover {
    opacity: 0.4;
  }
`;

const BoardTitle = styled.div`
  margin: 4px;
  width: 70%;
  font-size: 18px;
  font-weight: 600;
  color: ${props => (props.selected ? pandaTeal : secondaryGray)};
`;

const LoadingText = styled.div`
  text-align: center;
  width: 100%;
  font-weight: bold;
  padding: 12px;
`;

// interface Props {
//   userId?: string;
//   biteIds?: string[];
//   audienceRating?: string;
//   visibility?: string;
//   onCreatePlaylist?: any;
// }
//
// interface State {}

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
        !previousResult.twitch.playlistElasticSearch.pageInfo.hasNextPage
      ) {
        // TODO: set finished loading all blerps logo
        return previousResult;
      }

      if (
        !fetchMoreResult ||
        !fetchMoreResult.twitch.playlistElasticSearch ||
        fetchMoreResult.twitch.playlistElasticSearch.items.length === 0
      ) {
        return previousResult;
      }

      return {
        // Concatenate the new search results after the old ones
        twitch: {
          ...fetchMoreResult.twitch,
          playlistElasticSearch: {
            ...fetchMoreResult.twitch.playlistElasticSearch,
            pageInfo: {
              ...fetchMoreResult.twitch.playlistElasticSearch.pageInfo
            },
            items: previousResult.twitch.playlistElasticSearch.items.concat(
              fetchMoreResult.twitch.playlistElasticSearch.items
            )
          }
        }
      };
    },
    variables: {
      pageCount: dataProp.twitch.playlistElasticSearch.pageInfo.currentPage + 1
    }
  });
};

function uniq(a) {
  return Array.from(new Set(a));
}

const DefaultProps = {};

export class BoardSearchScreen extends React.Component {
  static defaultProps = DefaultProps;
  state = {
    searchQuery: this.props.searchQuery || "",
    tempSearchQuery: this.props.searchQuery || ""
  };

  onSearchChange = event => {
    this.setState({ tempSearchQuery: event.target.value });

    setTimeout(() => {
      this.setState({ searchQuery: this.state.tempSearchQuery });
    }, 1500);
  };

  selectBoard = (boardId, biteIds) => async () => {
    if (this.props.handleSelectBoard) {
      this.props.handleSelectBoard({ boardId, selectedType: "SEARCH" });
    }
  };

  renderBoards = (boards, selectedIds) => (index, key) => {
    const board = boards[index];
    if (board) {
      const checked = selectedIds.indexOf(board._id) !== -1;
      return (
        <BoardRowContainer
          key={board._id}
          onClick={this.selectBoard(board._id, board.biteIds)}
        >
          <BoardSquareContainer>
            <BoardImage
              src={
                (board.image && board.image.original.url) ||
                (board.giphy && board.giphy.gif) ||
                "https://storage.googleapis.com/blerp-main-bucket/images/default2-a89e-4a33-8a26-4fff77cd9607.png"
              }
            />
            <StyledPlusCheckButton isChecked={checked} />
          </BoardSquareContainer>
          <Scrim />
          <BoardTitle>{board.title}</BoardTitle>
        </BoardRowContainer>
      );
    }
  };

  render() {
    return (
      <React.Fragment>
        <InputRowContainer>
          <TextInput
            placeholder="Search for Soundboards"
            onTextChange={this.onSearchChange}
            errorMessage={this.state.boardError}
            value={this.state.boardTitle}
          />
        </InputRowContainer>
        <Query
          query={FETCH_SEARCH_QUERY}
          notifyOnNetworkStatusChange={true}
          ssr={false}
          fetchPolicy={"network-only"}
          variables={{
            query: this.state.searchQuery,
            pageCount: 0,
            perPage: 30
          }}
        >
          {({ loading, error, data, networkStatus, fetchMore }) => {
            if (networkStatus === 1 || networkStatus === 2 || !data) {
              return (
                <ListContainer>
                  <LoadingText>{"Hacky Loading Icon!!"}</LoadingText>
                </ListContainer>
              );
            }

            if (
              data &&
              data.twitch &&
              data.twitch.playlistElasticSearch &&
              data.twitch.playlistElasticSearch.items &&
              data.twitch.playlistElasticSearch.items.length === 0 &&
              this.state.searchQuery !== ""
            ) {
              return (
                <ListContainer>
                  <LoadingText>{"No Search Results"}</LoadingText>
                </ListContainer>
              );
            }

            return (
              <ListContainer>
                <VerticalList
                  listLoadMore={handleListLoadMore(
                    data,
                    networkStatus,
                    fetchMore
                  )}
                  length={
                    data &&
                    data.twitch &&
                    data.twitch.playlistElasticSearch &&
                    data.twitch.playlistElasticSearch.items &&
                    data.twitch.playlistElasticSearch.items.length
                  }
                  renderListItems={this.renderBoards(
                    data &&
                      data.twitch &&
                      data.twitch.playlistElasticSearch &&
                      data.twitch.playlistElasticSearch.items,
                    this.props.selectedIds
                  )}
                />
              </ListContainer>
            );
          }}
        </Query>
      </React.Fragment>
    );
  }
}

export default BoardSearchScreen;
