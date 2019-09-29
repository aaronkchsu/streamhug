/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import * as React from "react";
import styled, { keyframes } from "styled-components";
import CloseButton from "./buttons/CloseButton";
import {WidePinkButton} from "./buttons/PinkButton"
import Header from './Header';

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
  bodyText
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
  background-color: rgba(255, 255, 255, 1);
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

const HeaderText = styled.div`
  font-weight: 600;
  text-align: center;
  font-size: 28px;
  line-height: 28px;
  padding: 12px;
  text-decoration: none;
  color: ${bodyText};
`;

const SecondaryText = styled.div`
  text-align: center;
  font-size: 14px;
  line-height: 14px;
  text-decoration: none;
  margin: 8px;
  color: ${props => (props.color ? props.color : secondaryText)};
`;

const SecondaryTextLeft = styled.div`
  width: 90%;
  text-align: left;
  font-size: 14px;
  line-height: 14px;
  margin: 8px;
  color: ${props => (props.color ? props.color : secondaryText)};
`;

const StyledCloseButton = styled(CloseButton)`
  position: absolute;
  top: 16px;
  right: 16px;
`;

const ImageContainer = styled.div``

const MenuIconImage = styled.img`
  height: 32px;
  align-self: center;
`;


const ShareImage = styled.img`
  width: 200px;
  align-self: center;
  white-space: nowrap;
  margin: 8px;
`;

class FirstScreenInteraction extends React.Component {
  handleCloseClick = () => {
    if (this.props.onCloseClick) {
      this.props.onCloseClick();
    }
  };

  render() {
    return (
      <ScreenContainer
        showScreen={true}
        isOverlay={this.props.isOverlay}
      >
        <Header />
        <StyledCloseButton lightIcon={false} onClick={this.handleCloseClick} />
  
        <HeaderText>{`Config Panel`}</HeaderText>

        <SecondaryText>
          * Use this panel to <b>control content, set playback volumes, and change cooldown times!</b>
        </SecondaryText>

        <SecondaryText>
          * You can <b>set different bit amounts</b> to play a sound <b>for subscribers and viewers</b>
        </SecondaryText>
       
        <WidePinkButton onClick={this.handleCloseClick}>{"Begin Extension Setup"}</WidePinkButton>
      </ScreenContainer>
    );
  }
}

export default FirstScreenInteraction;
