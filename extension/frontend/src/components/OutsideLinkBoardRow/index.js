/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import * as React from "react";
import styled from "styled-components";
import OutsideBoardLink from "./OutsideBoardLink";
import HorizontalList from "../lists/HorizontalList";
import gql from "graphql-tag";
import { Query } from "react-apollo";

import {
  pandaPink,
  flyoutBackground,
  statusColor,
  placeholderText,
  primaryText,
  bodyText,
  secondaryText,
  pandaTeal,
  bitNumberToColor
} from "../../other/colors";

const Container = styled.div`
  display: flex;
  overflow: hidden;
  flex-direction: column;
  width: 100%;

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
  color: ${secondaryText};
  font-weight: bold;
  font-size: 16px;
  align-self: flex-start;
  text-decoration: none;
  margin: 8px 0;
`;

const PlaylistsContainer = styled.div`margin: 8px;`;

const GET_BOARD_CONFIG_PANEL = gql`
  query twitchGetBoardsForConfigPanel($ids: [MongoID]!) {
    twitch {
      playlistByIds(_ids: $ids) {
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

const RecentText = styled.div`
  font-size: 20px;
  padding: 12px;
  font-weight: light;
  margin: 0;
  color: ${bodyText};
`;

class OutsideLinkBoardRow extends React.Component {
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
        <OutsideBoardLink
          id={board._id}
          title={board.title}
          color={board.color}
          imageUrl={(board.giphy && board.giphy.gif) || (board.image && board.image.original.url)}
        />
      </PlaylistsContainer>
    );
  }

  render() {
    if (!this.props.boardIds || this.props.boardIds.length === 0) {
      return (
        <RecentText>{"No boards Selected!"}</RecentText>
      );
    }

    return (
      <Container>
        <PlaylistsContainerTitle>{this.props.title}</PlaylistsContainerTitle>
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
                {"Loading more items"}
              </div>
            );
          }
          const boards = data.twitch.playlistByIds ? data.twitch.playlistByIds : [] 
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

export default OutsideLinkBoardRow;
