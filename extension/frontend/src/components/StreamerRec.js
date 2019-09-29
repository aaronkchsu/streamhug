/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import Observer from "@researchgate/react-intersection-observer";
import * as React from "react";
import styled, { keyframes } from "styled-components";

import { randomBlerpColor, headerBackground } from "../other/colors";

const animateIn = keyframes`
  0% {
    opacity: 0;
  }

  25% {
    opacity: 0.2;
  }

  50% {
    opacity: 0.6;
  }

  75% {
    opacity: 0.9;
  }

  100% {
    opacity: 1;
  }
`;

const Container = styled.div`
  width: 100px;
  height: 100px;
  position: relative;
  border-radius: 8px;
  pointer: cursor;
  animation: ${animateIn} 0.4s 1;
`;

const BackgroundImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 100px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  z-index: 1;
  border-radius: 8px;
  animation: ${animateIn} 0.4s 1;
`;

const Scrim = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 100px;
  background-color: ${(props) =>
    props.darker ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0.2)"};
  box-shadow: inset 0 0 70px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  z-index: 80;
  border-radius: 8px;
  animation: ${animateIn} 0.4s 1;

  &:hover span {
    color: rgba(180, 180, 180, 1);
    transition: all 0.2s ease 0s;
  }

  &:hover {
    box-shadow: inset 0 0 70px 1em rgba(0, 0, 0, 1);
    transition: all 0.3s ease 0s;
  }
`;

const TitleSection = styled.div`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  height: 40px;
  bottom: 0;
  background-color: rgba(89, 88, 82, 0.6);
  border-radius: 0 0 8px 8px;
  display: flex;
  width: 100%;
  overflow: hidden;
`;

const TitleText = styled.div`
  width: 150px;
  padding: 0;
  overflow: hidden;
  flex-direction: row;
  font-size: 12px;
  width: 80px;
  font-size: 12px;
  height: initial;
  text-align: center;
  color: rgba(255, 255, 255, 1);
  text-overflow: ellipsis;
  display: box;
  line-height: 20px;
  z-index: 100;
  padding: 0 12px;
  font-weight: lighter;

  &:active {
    color: rgba(150, 150, 150, 1);
    transition: all 0.2s ease 0s;
  }
`;

// interface Props {
//   color?: string,
//   id: string,
//   title: string,
//   imageUrl?: string
// }
//
// interface State {
//   color: string,
//   observed: boolean
// }

class StreamerSquare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: randomBlerpColor(),
      observed: false
    };
  }

  hideErrorImage(i) {
    i.target.style.display = "none";
  }

  navigateToBoardScreen = () => {
    this.props.onStreamerClick()
  }

  render() {
    return (
      <Observer onChange={this.handleIntersection}>
        <Container
          style={{
            backgroundColor: headerBackground
          }}
          role="listitem"
          title={this.props.title}
          onClick={this.navigateToBoardScreen}
        >
          {this.state.observed ? (
            <Scrim darker={Boolean(this.props.imageUrl)}>
              <TitleSection>
                <TitleText>{this.props.title}</TitleText>
              </TitleSection>
            </Scrim>
          ) : null}
          {this.props.imageUrl &&
            this.state.observed && (
              <BackgroundImage
                aria-hidden="true"
                src={this.props.imageUrl}
                onError={this.hideErrorImage}
              />
            )}
        </Container>
      </Observer>
    );
  }

  handleIntersection = event => {
    this.setState({ observed: event.isIntersecting });
  };
}

export default StreamerSquare;
