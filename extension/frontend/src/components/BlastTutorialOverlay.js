/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import * as React from 'react';
import styled, { keyframes } from 'styled-components';
import DotsIndicator from './DotsIndicator';
import PinkButton from './buttons/PinkButton';

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
  secondaryText,
  lightGray
} from '../other/colors';

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
  background-color: rgba(0, 0, 0, .3);
  width: 100%;
  height: 100%;
  max-height: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000001;
  border-radius: 0;
  visibility: ${(props) => {
		return props.showScreen ? "visible" : "hidden";
	}};
  opacity: ${(props) => {
    return props.showScreen ? 1 : 0;
  }};
  top: ${(props) => {
    return props.showScreen ? '0' : `${screenSizeHide}px`;
  }};
  animation: ${(props) => {
      return props.showScreen ? slideIn : slideOut;
    }}
    0.5s 1;
  border-radius: ${(props) => (props.isOverlay ? '12px' : '0')};

  @media (min-width: 600px) {
    justify-content: center;
  }
`;

const CardContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 12px;
  margin: 12px;
  flex-direction: column;
`;

const HeaderText = styled.div`
  font-weight: 600;
  text-align: center;
  font-size: 24px;
  padding: 12px;
  text-decoration: none;
  color: ${secondaryText};
  white-space: nowrap;
`;

const SecondaryText = styled.div`
  font-weight: lighter;
  text-align: center;
  font-size: 14px;
  padding: 20px;
  text-decoration: none;
  color: ${(props) => (props.color ? props.color : secondaryText)};
  white-space: pre-wrap;
`;

const HeaderTextLeft = styled.div`
  font-weight: 600;
  text-align: left;
  width: 80%;
  font-size: 24px;
  padding: 12px;
  text-decoration: none;
  color: ${secondaryText};
  white-space: nowrap;
`;

const SecondaryTextLeft = styled.div`
  font-weight: lighte
  text-align: left;
  font-size: 14px;
  padding: 20px;
  text-decoration: none;
  color: ${(props) => (props.color ? props.color : secondaryText)};
  white-space: pre-wrap;
`;

const MainCornerButtonClose = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 1;
  z-index: 10;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  background-color: transparent;
  border: none;
`;

const MainCornerButtonCloseIcon = styled.img`
  width: 100%;
  height: 100%;
  align-self: center;
  white-space: nowrap;
`;

const ButtonIconNext = styled.img`
  width: 12px;
  height: 12px;
`;

const CardImage = styled.img`
  position: relative;
  height: 128px;
  border-radius: 12px;
  margin: 12px;
`;

const ButtonNextPreviousRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
`;

const NextButton = styled(PinkButton)`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const BorderLine = styled.div`
  border-width: 1px;
  margin: 16px 0 8px;
  border-color: ${lightGray};
  border-style: solid;
  width: 60%;
`;

const NUMBER_OF_CARDS = 4;

class BlastTutorialOverlay extends React.Component {
  state = {
    currentCardIndex: this.props.currentCardIndex || 0
  };

  timingIntervalCounter;

  componentDidMount() {}

  handleSelectIndex = (index) => {
    this.setState({ currentCardIndex: index });
  };

  handleNextIndex = () => {
    this.setState({ currentCardIndex: this.state.currentCardIndex + 1 });
  };

  handleCloseClick = () => {
    if (this.props.onCloseClick) {
      this.props.onCloseClick();
    }
  };

  renderCardOneContent() {
    return (
      <React.Fragment>
        <CardImage src="https://storage.googleapis.com/blerp_products/Twitch/Images/BlerpBlast_Step_01.png" />
        <HeaderText>{`What's a Blerp Blast?`}</HeaderText>
        <BorderLine />
        <SecondaryText>
          {
            'If you subscribe to *Example_Streamer* you can send up to x blerps, one after the other. Click next to see how it works!'
          }
        </SecondaryText>
        <ButtonNextPreviousRow>
          <NextButton onClick={this.handleNextIndex}>
            {'Next'}
            <ButtonIconNext src="https://storage.googleapis.com/blerp_products/Twitch/Assets/Arrows/Chevron_White_Right.svg" />
          </NextButton>
        </ButtonNextPreviousRow>
      </React.Fragment>
    );
  }

  renderCardTwoContent() {
    return (
      <React.Fragment>
        <HeaderTextLeft>{'1 Step One'}</HeaderTextLeft>
        <SecondaryTextLeft>{'First, subscribe to *Example_Streamer* to enable the Blerp Blast.'}</SecondaryTextLeft>
        <CardImage src="https://storage.googleapis.com/blerp_products/Twitch/Images/BlerpBlast_Step_02.png" />
        <ButtonNextPreviousRow>
          <NextButton onClick={this.handleNextIndex}>
            {'Next'}
            <ButtonIconNext src="https://storage.googleapis.com/blerp_products/Twitch/Assets/Arrows/Chevron_White_Right.svg" />
          </NextButton>
        </ButtonNextPreviousRow>
      </React.Fragment>
    );
  }

  renderCardThreeContent() {
    return (
      <React.Fragment>
        <HeaderTextLeft>{'2 Step Two'}</HeaderTextLeft>
        <SecondaryTextLeft>{'Choose from thousands of Blerps to add to your queue.'}</SecondaryTextLeft>
        <CardImage src="https://storage.googleapis.com/blerp_products/Twitch/Images/BlerpBlast_Step_03.png" />
        <ButtonNextPreviousRow>
          <NextButton onClick={this.handleNextIndex}>
            {'Next'}
            <ButtonIconNext src="https://storage.googleapis.com/blerp_products/Twitch/Assets/Arrows/Chevron_White_Right.svg" />
          </NextButton>
        </ButtonNextPreviousRow>
      </React.Fragment>
    );
  }

  renderCardFourContent() {
    return (
      <React.Fragment>
        <HeaderTextLeft>{'3 Step Three'}</HeaderTextLeft>
        <SecondaryTextLeft>{`Once you're ready Blast hit the share icon on the right. That's it!`}</SecondaryTextLeft>
        <CardImage src="https://storage.googleapis.com/blerp_products/Twitch/Images/BlerpBlast_Step_04.png" />
        <ButtonNextPreviousRow>
          <NextButton onClick={this.handleCloseClick}>{'Done'}</NextButton>
        </ButtonNextPreviousRow>
      </React.Fragment>
    );
  }

  renderCardContent() {
    switch (this.state.currentCardIndex) {
      case 0:
        return this.renderCardOneContent();
      case 1:
        return this.renderCardTwoContent();
      case 2:
        return this.renderCardThreeContent();
      case 3:
        return this.renderCardFourContent();
      default:
        return this.renderCardOneContent();
    }
  }

  render() {
    return (
      <ScreenContainer showScreen={this.props.showScreen} isOverlay={this.props.isOverlay}>
        <CardContainer>
          <MainCornerButtonClose onClick={this.handleCloseClick}>
            <MainCornerButtonCloseIcon src="https://storage.googleapis.com/blerp-public-images/twitch/dark-close-icon.svg" />
          </MainCornerButtonClose>
          {this.renderCardContent()}
          <DotsIndicator
            selectedIndex={this.state.currentCardIndex}
            numberOfSteps={NUMBER_OF_CARDS}
            onSelect={this.handleSelectIndex}
          />
        </CardContainer>
      </ScreenContainer>
    );
  }
}

export default BlastTutorialOverlay;
