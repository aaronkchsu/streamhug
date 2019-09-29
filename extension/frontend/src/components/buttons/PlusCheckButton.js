import * as React from "react";
import PlusIcon from "../../icons/plus-icon";
import TealCheckIcon from "../../icons/teal-check-icon";
import styled, { keyframes } from "styled-components";
import gql from "graphql-tag";

import { Mutation } from "react-apollo";

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
  width: 24px;
  height: 24px;
  background-position: center;
  transition: ease-in-out;
  transition: background 1.2s;
  background-position: center;
  z-index: 50;
  animation: ${bounceOut} 0.2s 1;
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
      props.isFeaturedBite ? iconsInActive : pandaNewTeal};
    opacity: 1;
  }

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 600px) {
  }
`;

const CheckedButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: ${flyoutBackground};
  width: 24px;
  height: 24px;
  background-position: center;
  transition: ease-in-out;
  transition: background 1.2s;
  animation: ${bounceOut} 0.2s 1;
  z-index: 50;
  opacity: 1;
  border: 2px ${pandaNewTeal} solid;
  border-radius: 40px;
  padding: 0;

  &:focus {
    opacity: 1;
    outline: 0 !important;
    box-shadow: none !important;
  }

  &:active {
    background-color: ${props =>
      props.isFeaturedBite ? iconsInActive : pandaNewTeal};
    opacity: 1;
  }

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 600px) {
  }
`;

const StyledPlusIcon = styled(PlusIcon)``;

const IconContainer = styled.div`
  width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default class PlusCheckButton extends React.Component {
  handleOnClick = () => {
    if (this.props.onClick) {
      this.props.onClick();
    }
  };

  render() {
    if (this.props.isChecked) {
      return (
        <CheckedButton
          className={this.props.className}
          onClick={this.handleOnClick}
        >
          <IconContainer>
            <TealCheckIcon />
          </IconContainer>
        </CheckedButton>
      );
    } else {
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
}
