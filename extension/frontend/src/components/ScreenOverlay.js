/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import * as React from "react";
import ReactDOM from "react-dom";
import styled, { keyframes } from "styled-components";

import TermsServiceRow from "./TermsServiceRow";
import BiteBitProfile from "./BiteBitProfile";
import CongratsScreenOverlay from "./CongratsScreenOverlay";

import {
  getTwitchCurrentBitProducts,
  convertBitNumberToSKU,
  attemptBuyProduct
} from "../other/twitchApi";

import {
  actionBackground,
  primaryText,
  flyoutBackground,
  pandaPink,
  defaultBackground,
  darkBackground,
  headerText,
  iconsActive,
  inputBorderColor,
  secondaryGray,
  secondaryText,
  secondarySubtitleText,
  bitNumberToColor
} from "../other/colors";

import PinkButton from "./buttons/PinkButton";
import CloseSecondaryButtonModalWrapper from "./buttons/CloseSecondaryButtonModalWrapper";
import CloseButtonModalWrapper from "./buttons/CloseButtonModalWrapper";

const screenSizeHide = 3024;

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

const slideOut = keyframes`
  0% {
    top: 0;
  }

  25% {

  }

  50% {
  }

  75% {
  }

  100% {
    top: ${screenSizeHide}px;
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
  max-height: 700px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100000;
  border-radius: 0;
  max-height: 496px;
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
      return props.showScreen ? slideIn : "none";
    }}
    0.6s 1;

  @media (min-width: 600px) {
    justify-content: center;
  }
`;

const TopHalf = styled.div`
  width: 100%;
  height: 15%;
  background-color: ${darkBackground};
  opacity: ${props => {
    return props.showScreen ? 0.5 : 0;
  }};
  animation: ${props => {
      return props.showScreen ? fadeIn : fadeOut;
    }}
    1s 1;
`;

const BottomHalf = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 85%;
  background-color: ${flyoutBackground};
  border-radius: ${props => (props.isOverlay ? "12px" : "0")};
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

const SecondaryText = styled.div`
  font-weight: 600;
  text-align: center;
  font-size: 16px;
  line-height: 12px;
  text-decoration: none;
  color: ${props => (props.color ? props.color : secondaryText)};
  white-space: nowrap;
`;

const BorderLine = styled.div`
  border-width: 1px;
  margin: 16px 0 8px;
  border-color: ${secondaryText};
  border-style: solid;
  width: 60%;
`;

const StyledBiteBitProfile = styled(BiteBitProfile)`
  position: absolute;
  top: 6%;
`;

const BottomHalfBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 40px;
`;

const StyledCloseButton = styled(CloseButtonModalWrapper)`
  align-self: flex-end;
  margin: 8px;
`;

class ScreenOverlay extends React.Component {
  constructor(props) {
    super(props);

    this.modalRoot = props.rootNode || document.getElementById("root");
    this.el = document.createElement("div");
  }

  setCongrats = congratsBoolean => {
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

  handleCloseClick = () => {};

  handleShareClick = async () => {
    // const arrow = await getTwitchCurrentBitProducts();
    const getTwitchChannelSettings = await this.props.authNetwork.getTwitchChannelSettings();
    const currentBitSKU = convertBitNumberToSKU(getTwitchChannelSettings.bitCost);

    if (this.props.isStreamer || Number(getTwitchChannelSettings.bitCost) === 0) {
      const playResponse = await this.props.authNetwork.postAudioUrlPlay({
        audioUrl: this.props.audioUrl,
        imageUrl: this.props.imageUrl,
        biteId: this.props.biteId,
        biteTitle: this.props.biteTitle,
        transactionObj: null,
        roomId: this.props.roomId
      });
      this.props.showCooldown();
      this.setCongrats(true);
    } else {
      try {
        const boughtResponse = await attemptBuyProduct(currentBitSKU);
      } catch (err) {
        this.setCongrats(false);
      }
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
          <StyledBiteBitProfile
            imageUrl={
              this.props.imageUrl ||
              "https://storage.googleapis.com/blerp-main-bucket/images/default2-a89e-4a33-8a26-4fff77cd9607.png"
            }
            bitCount={this.props.bitCount}
          />
          <StyledCloseButton onClick={this.handleCloseClick} />
          <BottomHalfBody>
            <HeaderText>{this.props.biteTitle}</HeaderText>
            <BorderLine />
            <ShareBitTextContainer>
              <SecondaryText>{"Share Blerp for"}</SecondaryText>
              <div>&nbsp;</div>
              <SecondaryText
                color={bitNumberToColor(this.props.bitCount)}
              >{`${this.props.bitCount}`}</SecondaryText>
              <div>&nbsp;</div>
              <SecondaryText>
                {Number(this.props.bitNumber) === 1 ? " bit" : " bits"}
              </SecondaryText>
            </ShareBitTextContainer>
            <PinkButton onClick={this.handleShareClick}>{"Share"}</PinkButton>
            <CloseSecondaryButtonModalWrapper>
              {"Cancel"}
            </CloseSecondaryButtonModalWrapper>
          </BottomHalfBody>
          <TermsServiceRow isOverlay={this.props.isOverlay} />
        </BottomHalf>
      </ScreenContainer>,
      this.el
    );
  }
}

export default ScreenOverlay;
