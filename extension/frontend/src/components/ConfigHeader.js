/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import * as React from "react";
import styled, { keyframes } from "styled-components";

import { SCREENS } from "../data/screens";

import LightCloseButton from "../icons/light-close-icon";

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
  darkRedStatus,
  pandaTeal,
  darkText,
  lightGray
} from "../other/colors";

const ScreenChangeButton = styled.button`
  font-weight: lighter;
  padding: 8px;
  text-decoration: none;
  white-space: nowrap;
  background: transparent;
  border: 1px solid ${lightGray};
  opacity: 0.6;
  font-size: 14px;
  line-height: 14px;
  border-radius: 8px;
  pointer-events: all;
  width: 100%;
  text-align: center;
  text-overflow: ellipsis;
  overflow: hidden;
  background-color: ${defaultBackground};
  margin: 4px;

  &:focus {
    border-radius: 8px;
    border: 2px solid ${pandaTeal} !important;
    outline: 0 !important;
    box-shadow: none !important;
  }

  &:hover {
    opacity: 0.4;
  }

  &:active {
    opacity: 0.8;
  }
`;

const Logo = styled.img`
  height: 40%;
  margin: auto 8px;
`;

const A = styled.a`
  height: 80px;
  display: inline-flex;
`;

const NavContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: transparent;
  width: 100%;

  @media (max-width: 600px) {
    justify-content: center;
  }
`;

const animateIn = keyframes`
  0% {
    opacity: 0;
  }

  25% {
    opacity: 0.2;
  }

  50% {
    opacity: 0.6;
  }

  75% {
    opacity: 0.9;
  }

  100% {
    opacity: 1;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${props => (props.color ? props.color : "transparent")};
  animation: ${animateIn} 0.4s 1;
  display: flex;
  justify-content: space-between;
  padding: 0 12px;
  height: 40px;
  width: 100%;
`;

const BlerpPrice = styled.div`
  color: ${flyoutBackground};
  font-weight: bold;
`;

const ButtonText = styled.div`
  color: ${darkText};
  text-overflow: ellipsis;
`;

class ConfigHeader extends React.Component {
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      searchOpen: props.searchOpen || true
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.bitsOpen) {
      this.setState({ searchOpen: true });
    }
  }

  componentDidMount() {}

  handleOpenBite = () => {
    this.setState({ searchOpen: true });
  };

  handleScreenChange = () => {
    if (this.props.isConfigShowing) {
      this.props.handleScreenChangeCallback(SCREENS.popular);
    } else {
      this.props.handleScreenChangeCallback(SCREENS.config);
    }
  };

  handleOpenFeedbackForm = () => {
    window.open("https://goo.gl/forms/78xaUJ4ouWKjAIOm1", "_blank");
  };

  render() {
    return (
      <NavContainer>
        <Container color={this.props.color}>
          <ScreenChangeButton onClick={this.handleScreenChange}>
            <ButtonText>{`${this.props.isConfigShowing
              ? "Go to Soundboard"
              : "Back to Config"}`}</ButtonText>
          </ScreenChangeButton>
          <ScreenChangeButton onClick={this.handleOpenFeedbackForm}>
            <ButtonText>{"Feedback"}</ButtonText>
          </ScreenChangeButton>
        </Container>
      </NavContainer>
    );
  }
}

export default ConfigHeader;
