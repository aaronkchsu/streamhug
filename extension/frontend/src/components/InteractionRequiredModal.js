/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import * as React from "react";
import styled, { keyframes } from "styled-components";
import CloseButton from "./buttons/CloseButton";

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
  background-color: rgba(0, 0, 0, 0.85);
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
	opacity: ${(props) => {
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
`;

const HeaderText = styled.div`
  font-weight: 600;
  text-align: center;
  font-size: 28px;
  line-height: 28px;
  padding: 12px;
  text-decoration: none;
  color: ${flyoutBackground};
`;

const SecondaryText = styled.div`
  font-weight: 600;
  text-align: center;
  font-size: 14px;
  line-height: 14px;
  text-decoration: none;
  color: ${props => (props.color ? props.color : pandaPink)};
`;

const TextContainer = styled.div`
  position: absolute;
  top: 120px;
  padding: 20px;
  width: 300px;
`;

const StyledCloseButton = styled(CloseButton)`
  position: absolute;
  top: 16px;
  right: 16px;
`;

class InteractionRequiredModal extends React.Component {
  handleCloseClick = () => {
    if (this.props.onCloseClick) {
      this.props.onCloseClick();
    }
  };

  render() {
    return (
      <ScreenContainer
        onClick={this.handleCloseClick}
        showScreen={this.props.showScreen}
        isOverlay={this.props.isOverlay}
      >
        <StyledCloseButton lightIcon={true} onClick={this.handleCloseClick} />
        <TextContainer>
          <HeaderText>{"Interaction Required"}</HeaderText>
          <SecondaryText>
            {
              "Browsers require user interaction before they will play audio. Just click to continue."
            }
          </SecondaryText>
        </TextContainer>
      </ScreenContainer>
    );
  }
}

export default InteractionRequiredModal;
