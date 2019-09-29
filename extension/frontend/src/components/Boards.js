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

import {
  pandaPink,
  flyoutBackground,
  statusColor,
  placeholderText,
  primaryText,
  bodyText,
  pandaTeal,
  bitNumberToColor,
  defaultBackground
} from "../other/colors";

const Container = styled.div`
  display: flex;
  overflow: hidden;
  flex-direction: column;
  background-color: ${defaultBackground};
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
  display: flex;
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

class Boards extends React.Component {
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

  renderPlayLists = (index, key) => {
    const board = this.props.playlists[index];
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
    if (this.props.playlists.length === 0) {
      return (
        <div />
      );
    }

    return (
      <Container>
        <PlaylistsContainerTitle>{this.props.title}</PlaylistsContainerTitle>
        <HorizontalList
          length={
            this.props.playlists.length
          }
          renderListItems={this.renderPlayLists}
          showArrows={true}
          isGrayButton={true}
        />
      </Container>
    );
  }
}

export default Boards;
