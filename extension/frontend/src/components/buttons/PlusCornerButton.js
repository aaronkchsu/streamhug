import * as React from "react";
import PlusIcon from "../../icons/plus-icon";
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
    width: 40px;
    height: 40px;
  }

  50% {
  }

  75% {
  }

  100% {
    opacity: 1;
    width: 32px;
    height: 32px;
  }
`;

const PlusButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: ${bodyText};
  width: 32px;
  height: 32px;
  background-position: center;
  transition: ease-in-out;
  transition: background 0.2s;
  background-position: center;
  z-index: 50;
  opacity: 1;
  border: 2px ${actionBackground} solid;
  border-radius: 40px;
  padding: 0;

  &:focus {
    opacity: 1;
    outline: 0 !important;
    box-shadow: none !important;
  }

  &:active {
    background-color: ${props =>
      props.isFeaturedBite ? pandaNewTeal : pandaNewTeal};
    opacity: 0.8;
  }

  &:hover {
    opacity: 0.6;
  }

  @media (max-width: 600px) {
  }
`;

const StyledPlusIcon = styled(PlusIcon)``;

const IconContainer = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default class PlustCornerButton extends React.Component {
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
          <StyledPlusIcon />
        </IconContainer>
      </PlusButton>
    );
  }
}
