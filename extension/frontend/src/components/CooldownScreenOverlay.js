/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import gql from "graphql-tag";
import * as React from "react";
import styled, { keyframes } from "styled-components";

import {
  actionBackground,
  primaryText,
  flyoutBackground,
  pandaPink,
  defaultBackground,
  headerText,
  iconsActive,
  inputBorderColor,
  secondaryGray,
  secondaryText
} from "../other/colors";

const screenSizeHide = 1024;

const slideIn = keyframes`
  0% {
    opacity: 0;
  }

  25% {

  }

  50% {
  }

  75% {
  }

  100% {
    opacity: 1;
  }
`;

const slideOut = keyframes`
  0% {
    opacity: 1;
    top: 0;
  }

  25% {

  }

  50% {
  }

  75% {
  }

  100% {
    opacity: 0;
    top: ${screenSizeHide}px;
  }
`;

const ScreenContainer = styled.div`
  position: fixed;
  background-color: rgba(255, 255, 255, 0.85);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000001;
  border-radius: 0;
  max-height: 720px;
  visibility: ${(props) => {
		return props.showScreen ? "visible" : "hidden";
	}};
  opacity: ${props => {
    return props.showScreen ? 1 : 0;
  }};
  top: ${props => {
    return props.showScreen ? "0" : `${screenSizeHide}px`;
  }};
  animation: ${props => {
      return props.showScreen ? slideIn : slideOut;
    }}
    0.5s 1;
  border-radius: ${props => (props.isOverlay ? "12px" : "0")};

  @media (min-width: 600px) {
    justify-content: center;
  }
`;

const CongratsImage = styled.img`
  width: 180px;
  align-self: center;
  white-space: nowrap;
`;

const HeaderText = styled.div`
  font-weight: 600;
  text-align: center;
  font-size: 40px;
  line-height: 28px;
  padding: 12px;
  text-decoration: none;
  color: ${secondaryText};
  white-space: nowrap;
`;

const SecondaryText = styled.div`
  font-weight: 600;
  text-align: center;
  font-size: 14px;
  line-height: 18px;
  padding: 20px;
  text-decoration: none;
  color: ${props => (props.color ? props.color : secondaryText)};
  white-space: pre-wrap;
`;

const FUNNY_LINES = [
  "WOW.. what a long wait.",
  "Powering up for the next blerp",
  "Hmm maybe I should ask him for a lower cooldown?",
  "The wait will be over soon!",
  "Blerp has a discord bot used by over 400,000 people!",
  "Oh the joys of hearing your favorite sound broadcasted to millions of people...",
  "Did you know we have blerp mobile apps for offline playback?",
  "Coome oonnn...",
  "Kaaaaamahaaamaahaaaaa!",
  "It's time to duel...",
  "Can we lower this cooldown?? I want more sounds.",
  "Let's hope that this wait does not take too long!",
  "Do or do not there is no try..",
  "Did you know blerp was started by a group of college students from the University of Utah?",
  "The most inspirational quote you will ever find",
  "Are we still friends??",
  "Did you know you can create your own sounds at blerp.com?",
  "(Place waiting text here)",
  "(Place funny pun here)",
  "We did not know what to put here... I hope the wait isn't too bad :)",
  "Did you know we have a discord bot for playing sounds in discord?",
  "Waiting is so fun!",
  "Waiting to share your next blerp..",
  "Did you know you can create and share audio clips from blerp.com?",
  "Did you know that blerp means sound in choplingo?"
];

class CooldownScreenOverlay extends React.Component {
  timingIntervalCounter;
  constructor(props) {
    super(props)
    this.state = {
      timerCount: props.currentCountdownTime <= 0 ? props.timeToResetTo : props.currentCountdownTime,
      funnyline: FUNNY_LINES[Math.floor(Math.random() * FUNNY_LINES.length)]
    };
  }
  componentDidMount() {
    this.intervalTimer();
  }

  intervalTimer = () => {
    this.props.cooldownTimeMutation({
      variables: {
        time: this.props.timeToResetTo,
        set: true
      }
    });
    this.timingIntervalCounter = setInterval(() => {
      this.setState({ timerCount: this.state.timerCount - 1 }, () => {
        this.props.cooldownTimeMutation({
          variables: {
            time: this.state.timerCount,
            set: true
          }
        });
        if (this.state.timerCount <= 0) {
          this.handleCloseClick(this.props.cooldownMutation)();
          clearInterval(this.timingIntervalCounter);
          this.timingIntervalCounter = null;
          this.props.cooldownTimeMutation({
            variables: {
              time: this.props.timeToResetTo,
              set: true
            }
          });
        }
      });
    }, 800);
  };

  handleCloseClick = mutationCall => async () => {
    await mutationCall({
      variables: {
        active: false
      }
    });
    if (this.props.onCloseClick) {
      this.props.onCloseClick();
    }
  };

  render() {
    return (
      <ScreenContainer
        showScreen={this.props.showScreen}
        isOverlay={this.props.isOverlay}
      >
        {/*<CongratsImage
            src={
              "https://storage.googleapis.com/blerp-public-images/twitch/twitch_congrats.svg"
            }
          />*/}
        <HeaderText>{this.state.timerCount}</HeaderText>
        <SecondaryText>{this.state.funnyline}</SecondaryText>
      </ScreenContainer>
    );
  }
}

export default CooldownScreenOverlay;
