/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import * as React from "react";
import styled, { keyframes } from "styled-components";

import LightCloseButton from "../icons/light-close-icon";
import DollarSignIcon from "../icons/dollar-sign-icon";

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
  pandaTeal
} from "../other/colors";

const StyledCloseButton = styled(LightCloseButton)`
  width: 16px;
  height: 16px;
`;

const BackIconButton = styled.button`
  font-weight: lighter;
  padding: 8px;
  text-decoration: none;
  white-space: nowrap;
  background: transparent;
  font-size: 14px;
  line-height: 14px;
  border: none;
  opacity: 1;
  border-radius: 8px;
  pointer-events: all;

  &:focus {
    border-radius: 8px;
    border: 2px solid ${pandaTeal} !important;
    outline: 0 !important;
    box-shadow: none !important;
  }

  &:hover {
    opacity: 0.6;
  }

  &:active {
    opacity: 0.8;
  }
`;

const MoneyButton = styled.button`
  width: 32px;
  height: 32px;
  font-weight: lighter;
  text-decoration: none;
  color: ${flyoutBackground};
  background: ${props => props.color};
  border-radius: 48px;
  font-size: 14px;
  line-height: 14px;
  border: none;
  padding: 4px;
  pointer-events: all;
  margin-left: auto;

  &:focus {
    border: 2px solid ${pandaTeal} !important;
    outline: 0 !important;
    box-shadow: none !important;  }

  &:hover {
    transition: all 0.2s ease 0s;
    opacity: 0.7;
    color: rgb(254, 41, 92);
  }

  &:active {
    color: rgba(150, 150, 150, 1);
    opacity: 0.9;
    transition: all 0.2s ease 0s;
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

const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${props => (props.color ? props.color : "transparent")};
  animation: ${animateIn} 0.4s 1;
  width: 100%;
  border-radius: 6px;
  margin: 8px 8px 4px;
  display: flex;
  justify-content: space-between;
  padding: 0 12px;
  height: 40px;
`;

const BlerpPrice = styled.div`
  color: ${flyoutBackground};
  font-weight: bold;
`;

const BitsText = styled.div`color: ${flyoutBackground};`;

class BitsHeader extends React.Component {
  static defaultProps = {
    displayButtons: true,
    displayOnMobile: "logo",
    initialSearchQuery: "",
    onlyBoardsAllowed: false
  };

  constructor(props) {
    super(props);
    this.state = {
      searchOpen: props.searchOpen || false
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.bitsOpen) {
      this.setState({ searchOpen: true });
    }
  }

  handleOpenBite = () => {
    this.setState({ searchOpen: true });
  };

  handleCloseSearch = () => {
    this.setState({ searchOpen: false }, () => {});
  };

  render() {
    return (
      <NavContainer>
        {this.state.searchOpen ? (
          <SearchContainer color={this.props.color}>
            <BlerpPrice>{"Bits to Send"}</BlerpPrice>
            <BitsText>{`${this.props.bitCount}`}</BitsText>
            {/* <BlerpPrice>{"Sub Bits"}</BlerpPrice>
            <BitsText>{`${this.props.subBitNumber}`}</BitsText> */}
            {this.props.onlyBoardsAllowed ? <React.Fragment>
              <BlerpPrice>{"Search Off"}</BlerpPrice>
              </React.Fragment> : <React.Fragment>
              <BlerpPrice>{"Rating"}</BlerpPrice>
              <BitsText>{this.props.mpaaRating}</BitsText>
            </React.Fragment>}
            <BackIconButton onClick={this.handleCloseSearch}>
              <StyledCloseButton />
            </BackIconButton>
          </SearchContainer>
        ) : (
          <SearchContainer>
            <MoneyButton onClick={this.handleOpenBite} color={this.props.color}>
              <DollarSignIcon />
            </MoneyButton>
          </SearchContainer>
        )}
      </NavContainer>
    );
  }
}

export default BitsHeader;
