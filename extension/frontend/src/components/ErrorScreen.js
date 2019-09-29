/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import * as React from "react";
import styled, { keyframes } from "styled-components";
import RandomBitesWrapper from "../components/RandomBitesWrapper";

// import LoadingFullScreen from "../components/loading/loading-full-screen";
// import LoadingScroll from "../components/loading/loading-scroll";

import {
  defaultBackground,
  statusColor,
  bodyText,
  pandaPink,
  flyoutBackground,
  secondarySubtitleText,
  secondaryText
} from "../other/colors";

const Container = styled.div`
  background-color: ${defaultBackground};
  position: relative;
  justify-content: center;
  width: 100%;
`;

const NoSearchHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: inherit;
  align-items: center;
  justify-content: space-evenly;
  padding: 40px 0;
  background-color: ${flyoutBackground};

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const NoSearchTextContainer = styled.div`
  text-align: center;
  z-index: 2;
`;

const NoSearchName = styled.h1`
  color: ${secondaryText};
  font-weight: 600;
  font-size: 48px;
  margin: 4px;
  z-index: 1;
`;

const NoSearchSubtitle = styled.h2`
  color: ${secondarySubtitleText};
  font-weight: lighter;
  padding: 8px;
  margin: 0;
  font-size: 32px;
  z-index: 1;
`;

const SadBlerpy = styled.img`
  position: absolute;
  width: 300px;
`;

export default class ErrorScreen extends React.Component {
  static defaultProps = {};

  renderNoSearchHeader() {
    return (
      <NoSearchHeaderContainer>
        <SadBlerpy src="https://storage.googleapis.com/blerp-web-images/main/sad-blerpy.png" />
        <NoSearchTextContainer>
          <NoSearchName>{this.props.mainText}</NoSearchName>
          <NoSearchSubtitle>{this.props.subtitle}</NoSearchSubtitle>
        </NoSearchTextContainer>
        {/* <PinkButton onClick={this.props.onPinkButtonClick}>
          {this.props.redirectButtonText}
        </PinkButton> */}
      </NoSearchHeaderContainer>
    );
  }

  render() {
    return (
      <Container role="application">
        {this.renderNoSearchHeader()}
        <RandomBitesWrapper loggedIn={this.props.loggedIn} currentMpaaRating={this.props.currentMpaaRating}/>
      </Container>
    );
  }
}
