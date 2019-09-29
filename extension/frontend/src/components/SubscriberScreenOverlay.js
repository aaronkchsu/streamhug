/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import * as React from 'react';
import ReactDOM from 'react-dom';
import styled, { keyframes } from 'styled-components';

import TermsServiceRow from './TermsServiceRow';
import CongratsScreenOverlay from './CongratsScreenOverlay';

import {
  actionBackground,
  primaryText,
  flyoutBackground,
  pandaPink,
  defaultBackground,
  darkBackground,
  darkBlue,
  headerText,
  iconsActive,
  inputBorderColor,
  secondaryGray,
  secondaryText,
  secondarySubtitleText,
  bitNumberToColor,
  pandaTeal,
  headerBackground,
  slidePurple,
  lightGray
} from '../other/colors';

import CloseButton from './buttons/CloseButton';

const screenSizeHide = 1024;

const slideIn = keyframes`
  0% {
    top: ${screenSizeHide}px;
  }

  25% {

  }

  50% {
  }

  75% {
  }

  100% {
    top: 0;
  }
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }

  25% {
    opacity: 0;
  }

  50% {
  }

  75% {
  }

  100% {
    opacity: 0.5;
  }
`;

const fadeOut = keyframes`
  0% {
    opacity: 0.5;
  }

  25% {

  }

  50% {
    opacity: 0;
  }

  75% {
    opacity: 0;
  }

  100% {
    opacity: 0;
  }
`;

// NOTE: We can put in slideOut in place of none but it makes transitions weird
const ScreenContainer = styled.div`
  position: fixed;
  background-color: transparent;
  width: 100%;
  height: 100%;
  max-height: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100000;
  border-radius: 0;
  visibility: ${(props) => {
		return props.showScreen ? "visible" : "hidden";
	}};
  opacity: ${props => {
    return props.showScreen ? 1 : 0;
  }};
  top: ${(props) => {
    return props.showScreen ? '0' : `${screenSizeHide}px`;
  }};
  animation: ${(props) => {
      return props.showScreen ? slideIn : 'none';
    }}
    0.6s 1;

  @media (min-width: 600px) {
    justify-content: center;
  }
`;

const TopHalf = styled.div`
  width: 100%;
  height: 5%;
  background-color: ${darkBackground};
  opacity: ${(props) => {
    return props.showScreen ? 0.5 : 0;
  }};
  animation: ${(props) => {
      return props.showScreen ? fadeIn : fadeOut;
    }}
    1s 1;
`;

const BottomHalf = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  height: 95%;
  background-color: ${flyoutBackground};
  border-radius: ${(props) => (props.isOverlay ? '12px' : '0')};
`;

const HeaderText = styled.div`
  font-weight: 600;
  text-align: center;
  font-size: 20px;
  width: 260px;
  line-height: 24px;
  text-decoration: none;
  color: ${secondaryText};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const ShareBitTextContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const TierRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  padding: 8px;
`;

const ColumnContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 8px 16px;
  background-color: ${defaultBackground};
`;

const SecondaryText = styled.div`
  font-weight: 600;
  text-align: center;
  font-size: 12px;
  line-height: 12px;
  text-decoration: none;
  color: ${(props) => (props.color ? props.color : secondaryText)};
  white-space: wrap;
`;

const SecondaryLeftText = styled.div`
  font-weight: 600;
  text-align: center;
  font-size: 12px;
  line-height: 12px;
  text-decoration: none;
  color: ${(props) => (props.color ? props.color : secondaryText)};
  white-space: wrap;
  margin: 12px;
`;

const SecondaryTierText = styled.div`
  font-weight: 600;
  text-align: center;
  font-size: 16px;
  line-height: 16px;
  text-decoration: none;
  color: ${(props) => (props.color ? props.color : secondaryText)};
  white-space: wrap;

  &:focus {
    color: ${pandaPink};
  }
`;

const PinkSelectedText = styled.div`
  font-weight: 600;
  text-align: center;
  font-size: 16px;
  line-height: 16px;
  text-decoration: none;
  color: ${pandaPink};
  white-space: wrap;
  text-decoration: underline;
`;

const BorderLine = styled.div`
  border-width: 1px;
  margin: 8px 0;
  border-color: ${secondaryText};
  border-style: solid;
  width: 60%;
`;

const BottomHalfBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const StyledCloseButton = styled(CloseButton)`
align-self: flex-end;
  margin: 8px;
`;

const SubscribeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  background-color: transparent;
  border: none;
  margin: 4px 8px;

  &:focus {
    outline: 0 !important;
    box-shadow: none !important;
    border-radius: 4px;
  }

  &:hover {
    opacity: 0.7;
  }
`;

const CancelText = styled.button`
  font-weight: 600;
  text-align: center;
  font-size: 12px;
  line-height: 14px;
  text-decoration: underline;
  color: ${darkBlue};
  white-space: nowrap;
  margin: 4px;
  border: none;
  outline: none;
  background-color: transparent;
`;

const SubscribeButtonContainer = styled.button`
  margin: 4px;
  font-weight: lighter;
  padding: 0;
  text-decoration: none;
  color: ${flyoutBackground};
  white-space: nowrap;
  background: ${headerBackground};
  border-radius: 40px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;

  &:focus {
    border: 2px solid ${flyoutBackground} !important;
    outline: 0 !important;
    box-shadow: none !important;
  }

  &:hover {
    transition: all 0.2s ease 0s;
    background: rgb(240, 240, 240);
    background: ${slidePurple};
  }

  &:active {
    color: rgba(150, 150, 150, 1);
    transition: all 0.2s ease 0s;
  }
`;

const SubscribeInnerButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 4px;
  font-weight: lighter;
  padding: 0;
  text-decoration: none;
  color: ${headerBackground};
  white-space: nowrap;
  background: ${flyoutBackground};
  border-radius: 40px;
  font-size: 14px;
  line-height: 14px;
  border: none;
  width: 89px;
  height: 32px;

  &:focus {
    border: 2px solid ${flyoutBackground} !important;
    outline: 0 !important;
    box-shadow: none !important;
  }

  &:hover {
    transition: all 0.2s ease 0s;
    background: rgb(240, 240, 240);
    color: ${flyoutBackground};
    background: ${pandaPink};
  }

  &:active {
    color: rgba(150, 150, 150, 1);
    transition: all 0.2s ease 0s;
  }
`;

const SubscriberPriceText = styled.div`
  font-weight: lighter;
  text-align: center;
  font-size: 12px;
  line-height: 12px;
  text-decoration: none;
  color: ${flyoutBackground};
  white-space: wrap;
  width: 60px;
  
  &:focus {
    color: ${flyoutBackground};
  }

  &:hover {
    color: ${flyoutBackground};
  }
`;

const SUBSCRIBE_TIERS = {
  tier1: 'TIER_1',
  tier2: 'TIER_2',
  tier3: 'TIER_3'
};

const SUBSCRIBE_TIERS_TWITCH_API = {
  TIER_1: '1000',
  TIER_2: '2000',
  TIER_3: '3000'
};

class SubscriberScreenOverlay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTier: SUBSCRIBE_TIERS.tier1
    };
    this.modalRoot = props.rootNode || document.getElementById('root');
    this.el = document.createElement('div');
  }

  setCongrats = (congratsBoolean) => {
    if (this.props.setCongrats) {
      this.props.setCongrats(congratsBoolean);
    }
  };

  componentWillReceiveProps(newProps) {
    // Potentially we may want to reset showCongrats at a different spot besides when we open it again
    // However this makes the animations the least funky
    if (!this.props.showScreen && newProps.showScreen) {
      this.setCongrats(false);
    }
  }

  componentDidMount() {
    this.modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    this.modalRoot.removeChild(this.el);
    this.onTransactionComplete == null;
    this.onTransactionCancelled == null;
  }

  handleSelectTier = (tier) => () => {
    this.setState({ selectedTier: tier });
  };

  handleSubscribeFinished = () => {
    if (!this.state.selectedTier) {
      return;
    }
    this.props.onSubscribeFinished(SUBSCRIBE_TIERS_TWITCH_API[this.state.selectedTier])
  }

  renderSubscribeButtons = () => {
    return (
      <TierRow>
        <SubscribeButton onClick={this.handleSelectTier(SUBSCRIBE_TIERS.tier1)}>
          {this.state.selectedTier === SUBSCRIBE_TIERS.tier1 ? (
            <PinkSelectedText>{"Tier 1"}</PinkSelectedText>
          ) : (
            <SecondaryTierText>{"Tier 1"}</SecondaryTierText>
          )}
        </SubscribeButton>
        <SubscribeButton onClick={this.handleSelectTier(SUBSCRIBE_TIERS.tier2)}>
          {this.state.selectedTier === SUBSCRIBE_TIERS.tier2 ? (
            <PinkSelectedText>{"Tier 2"}</PinkSelectedText>
            ) : (
              <SecondaryTierText>{"Tier 2"}</SecondaryTierText>
              )}
        </SubscribeButton>
        <SubscribeButton onClick={this.handleSelectTier(SUBSCRIBE_TIERS.tier3)}>
          {this.state.selectedTier === SUBSCRIBE_TIERS.tier3 ? (
            <PinkSelectedText>{"Tier 3"}</PinkSelectedText>
            ) : (
              <SecondaryTierText>{"Tier 3"}</SecondaryTierText>
              )}
        </SubscribeButton>
      </TierRow>
    );
  };

  renderSubscribeContent = () => {
    switch(this.state.selectedTier) {
      case SUBSCRIBE_TIERS.tier1:
        return (
          <ColumnContent>
            <SecondaryLeftText>{"Includes Ad-free viewing, chatting during Subscriber-Only Mode, Subscriber Badges and 3 Emotes."}</SecondaryLeftText>
            {/* <SecondaryLeftText>{"Plus, set a custom walk on sound that plays on stream when you join!"}</SecondaryLeftText> */}
            <SecondaryLeftText>{"Plus, the ability to play up to three blerps back to back on stream!"}</SecondaryLeftText>
            <SubscribeButtonContainer onClick={this.handleSubscribeFinished}>
              <SubscribeInnerButton>{"Subscribe"}</SubscribeInnerButton>
              <SubscriberPriceText>{"$4.99"}</SubscriberPriceText>
            </SubscribeButtonContainer>
            <CancelText onClick={this.props.onSubscribeCancel}>{'Cancel'}</CancelText>
          </ColumnContent>
        );
      case SUBSCRIBE_TIERS.tier2:
        return (
          <ColumnContent>
            <SecondaryLeftText>{"Includes Ad-free viewing, chatting during Subscriber-Only Mode, Subscriber Badges and 3 Emotes."}</SecondaryLeftText>
            <SecondaryLeftText>{"Plus 1 extra channel emote!"}</SecondaryLeftText>
            {/* <SecondaryLeftText>{"Plus, set a custom double walk on sound that plays on stream when you join!"}</SecondaryLeftText> */}
            <SecondaryLeftText>{"Plus, the ability to play up to four blerps back to back on stream!"}</SecondaryLeftText>
            <SubscribeButtonContainer onClick={this.handleSubscribeFinished}>
              <SubscribeInnerButton>{"Subscribe"}</SubscribeInnerButton>
              <SubscriberPriceText>{"$9.99"}</SubscriberPriceText>
            </SubscribeButtonContainer>
            <CancelText onClick={this.props.onSubscribeCancel}>{'Cancel'}</CancelText>
          </ColumnContent>
        );
      case SUBSCRIBE_TIERS.tier3:
        return (
          <ColumnContent>
            <SecondaryLeftText>{"Includes Ad-free viewing, chatting during Subscriber-Only Mode, Subscriber Badges and 3 Emotes."}</SecondaryLeftText>
            <SecondaryLeftText>{"Plus 2 extra channel emotes"}</SecondaryLeftText>
            <SecondaryLeftText>{"Plus, the ability to play up to five blerps back to back on stream!"}</SecondaryLeftText>
            <SubscribeButtonContainer onClick={this.handleSubscribeFinished}>
              <SubscribeInnerButton>{"Subscribe"}</SubscribeInnerButton>
              <SubscriberPriceText>{"$24.99"}</SubscriberPriceText>
            </SubscribeButtonContainer>
            <CancelText onClick={this.props.onSubscribeCancel}>{'Cancel'}</CancelText>
          </ColumnContent>
        );
      default:
        break;
    }
  };

  render() {
    if (this.props.showUserCongrats) {
      return ReactDOM.createPortal(
        <CongratsScreenOverlay
          showScreen={this.props.showScreen}
          onCloseClick={this.handleCloseClick}
          isOverlay={this.props.isOverlay}
        />,
        this.el
      );
    }

    return ReactDOM.createPortal(
      <ScreenContainer showScreen={this.props.showScreen}>
        <TopHalf showScreen={this.props.showScreen} />
        <BottomHalf isOverlay={this.props.isOverlay}>
          <StyledCloseButton onClick={this.props.onSubscribeCancel} />
          <BottomHalfBody>
            <HeaderText>{'Subscribe To Streamer?'}</HeaderText>
            <BorderLine />
            <ShareBitTextContainer>
              <SecondaryText>{'Select subscription level.'}</SecondaryText>
            </ShareBitTextContainer>
            {this.renderSubscribeButtons()}
            {this.renderSubscribeContent()}
          </BottomHalfBody>
          <TermsServiceRow isOverlay={this.props.isOverlay} />
        </BottomHalf>
      </ScreenContainer>,
      this.el
    );
  }
}

export default SubscriberScreenOverlay;
