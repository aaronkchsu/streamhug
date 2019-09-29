/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import * as React from "react";
import styled from "styled-components";
import BoardSquareWrapper from "./BoardSquareWrapper";
import HorizontalList from "./lists/HorizontalList";
import {Query} from "react-apollo";
import gql from "graphql-tag";

import {
  pandaPink,
  flyoutBackground,
  statusColor,
  placeholderText,
  primaryText,
  bodyText,
  pandaTeal,
  bitNumberToColor
} from "../other/colors";

const Container = styled.div`
  display: flex;
  overflow: hidden;
  flex-direction: column;
  background-color: ${flyoutBackground};
  padding: 0 40px 24px;

  @media (max-width: 600px) {
    padding: 8px;
  }
`;

const OuterContentContainer = styled.div`
  overflow-x: scroll;
  -ms-overflow-style: none;
  border-left: 2px solid #2d2d2d;
  border-right: 2px solid #2d2d2d;
  overflow-y: hidden;
  transition: 0.3s;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const InnerContentContainer = styled.div`
  display: flex;z
  flex-direction: row;
  position: relative;
  padding: inherit;
  width: fit-content;
`;

const PlaylistsContainerTitle = styled.p`
  color: ${bodyText};
  font-weight: bold;
  font-size: 16px;
  align-self: flex-start;
  text-decoration: none;
  margin: 8px 0;
`;

const PlaylistsContainer = styled.div`margin: 8px;`;

const GET_BOARD_CONFIG_PANEL = gql`
  query twitchGetBoardsStreamSelectedBoards($ids: [MongoID]!) {
    twitch {
      playlistByIdsShuffle(_ids: $ids) {
        _id
        title
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
`;

class StreamerSelectedBoards extends React.Component {
  containerScroll;
  props;

  constructor(props) {
    super(props);
    this.containerScroll = React.createRef();
  }

  itemsRenderer = (items, ref) => (
    <OuterContentContainer innerRef={this.containerScroll}>
      <InnerContentContainer id="boards-inner-bar-container" innerRef={ref}>
        {items}
      </InnerContentContainer>
    </OuterContentContainer>
  );

  renderPlayLists = (boards) => (index, key) => {
    const board = boards[index];
    return (
      <PlaylistsContainer key={key}>
        <BoardSquareWrapper
          id={board._id}
          title={board.title}
          color={board.color}
          imageUrl={(board.giphy && board.giphy.gif) || (board.image && board.image.original.url)}
        />
      </PlaylistsContainer>
    );
  }

  render() {
    if (this.props.boardIds.length === 0) {
      return (
        <div />
      );
    }

    return (
      <Container>
        <PlaylistsContainerTitle>{"Streamer's Choice Boards"}</PlaylistsContainerTitle>
        <Query 
          query={GET_BOARD_CONFIG_PANEL}
          notifyOnNetworkStatusChange={true}
          fetchPolicy={"network-only"}
          variables={{
            ids: this.props.boardIds 
          }}
        >
          {({ data, loading, error }) => {
            if ((!data && ! error )|| loading) {
              return (
                <div key={Math.floor(Math.random() * Math.floor(100000000))}>
                  {"Hacky loading icon"}
                </div>
              );
            }
            const boards = data.twitch.playlistByIdsShuffle ? data.twitch.playlistByIdsShuffle : [] 
            return (
              <HorizontalList
                length={
                  boards.length
                }
                renderListItems={this.renderPlayLists(boards)}
                showArrows={true}
                isGrayButton={false}
              />
            )
          }}
        </Query>
      </Container>
    );
  }
}

export default StreamerSelectedBoards;
