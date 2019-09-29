import * as React from "react";
import ShareIcon from "../icons/share-icon";
import styled, { keyframes } from "styled-components";

import {
  flyoutBackground,
  bodyText,
  pandaPink,
  iconsInActive,
  defaultBackground
} from "../other/colors";

const bounceOut = keyframes`
  0% {
    opacity: 0;
    width: 30px;
    height: 30px;
  }

  25% {
    width: 64px;
    height: 64px;
  }

  50% {
  }

  75% {
  }

  100% {
    opacity: 1;
    width: 52px;
    height: 52px;
  }
`;

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 3px solid ${defaultBackground};
  background-color: ${props =>
    props.isFeaturedBite ? pandaPink : iconsInActive};
  border-radius: 100px;
  width: 52px;
  height: 52px;
  background-position: center;
  transition: ease-in-out;
  transition: background 1.2s;
  background-position: center;
  z-index: 1001;
  animation: ${bounceOut} 0.2s 1;

  &:focus {
    opacity: 1;
    outline: 0 !important;
    box-shadow: none !important;
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
    transform: translate(90px, 90px);
    opacity: 1;
    width: 40px;
    height: 40px;
    padding: 0;
  }
`;

const ShareIconContainer = styled.div`
  width: 60%;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

export default class ShareButton extends React.Component {
  render() {
    return (
      <MenuButton
        className={this.props.className}
        biteId={this.props.id}
        isFeaturedBite={this.props.isFeaturedBite}
        onClick={this.props.onClick}
      >
        <ShareIconContainer>
          <ShareIcon />
        </ShareIconContainer>
      </MenuButton>
    );
  }
}
