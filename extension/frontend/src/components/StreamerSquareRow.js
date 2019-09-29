/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import * as React from "react";
import styled from "styled-components";
import StreamerSquare from "./StreamerSquare";
import HorizontalList from "./lists/HorizontalList";

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
  font-weight: normal;
  font-size: 16px;
  align-self: flex-start;
  text-decoration: none;
  margin: 8px 0;
`;

const PlaylistsContainer = styled.div`margin: 8px;`;


class StreamerSelectedBoards extends React.Component {
  containerScroll;
  props;

  constructor(props) {
    super(props);
    this.containerScroll = React.createRef();
  }
  
  renderPlayLists = (boards) => (index, key) => {
    const board = boards[index];
    return (
      <PlaylistsContainer key={key}>
        <StreamerSquare
          title={board.display_name}
          imageUrl={board.logo}
        />
      </PlaylistsContainer>
    );
  }

  render() {
    if (this.props.streamers.length === 0) {
      return (
        <div />
      );
    }

    return (
      <Container>
        <PlaylistsContainerTitle>{"Hugged Communities"}</PlaylistsContainerTitle>
        <HorizontalList
          length={
            this.props.streamers.length
          }
          renderListItems={this.renderPlayLists(this.props.streamers)}
          showArrows={true}
          isGrayButton={false}
        />
      </Container>
    );
  }
}

export default StreamerSelectedBoards;
