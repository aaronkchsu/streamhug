import * as React from "react";
import ShareIcon from "../../icons/share-icon";
import styled, { keyframes } from "styled-components";

import {
  flyoutBackground,
  bodyText,
  pandaPink,
  iconsInActive,
  actionBackground,
  pandaNewTeal
} from "../../other/colors";

const bounceOut = keyframes`
  0% {
    opacity: 0;
    width: 24px;
    height: 24px;
  }

  25% {
    width: 48px;
    height: 48px;
  }

  50% {
  }

  75% {
  }

  100% {
    opacity: 1;
    width: 40px;
    height: 40px;
  }
`;

const PlusButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: ${pandaPink};
  width: 40px;
  height: 40px;
  border: none;
  background-position: center;
  transition: ease-in-out;
  transition: background 1.2s;
  background-position: center;
  z-index: 50;
  animation: ${bounceOut} 0.2s 1;
  opacity: 1;
  border-radius: 40px;
  padding: 0;
  margin: 8px;

  &:focus {
    opacity: 1;
    outline: 0 !important;
    box-shadow: none !important;
    border: 2px ${actionBackground} solid;
  }

  &:active {
    background-color: ${props =>
      props.isFeaturedBite ? iconsInActive : pandaPink};
    opacity: 1;
  }

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 600px) {
  }
`;

const StyledShareIcon = styled(ShareIcon)`
  min-width: 20px;
  min-height: 20px;
`;

const IconContainer = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default class PinkSendButton extends React.Component {
  handleOnClick = () => {
    if (this.props.onClick) {
      this.props.onClick();
    }
  };

  render() {
      return (
        <PlusButton
          className={this.props.className}
          onClick={this.handleOnClick}
        >
          <IconContainer>
            <StyledShareIcon />
          </IconContainer>
        </PlusButton>
      );
  }
}
