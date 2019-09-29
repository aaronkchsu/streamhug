/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import * as React from "react";
import styled, { keyframes } from "styled-components";

import {
  bodyText,
  flyoutBackground
} from "../other/colors";

const ArrowImage = styled.img`
  width: 21px;
  height: 21px;
  background-position: center;
`;

const HeaderText = styled.div`
  text-decoration: none;
  color: ${bodyText};
  font-size: 14px;
  padding: 4px;
`;

const ArrowButton = styled.button`
  display: flex;
  flex-direction: row;
  text-decoration: none;
  background: transparent;
  padding: 0;
  align-items: center;
  justify-content: center;
  border: none;
  margin: 8px;

  &:hover {
    opacity: 0.7;
  }

  &:active {
    opacity: 0.9;
  }
`;

const RowContainer = styled.div`
  display: flex
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  background-color: ${(props) => props.backgroundColor};
`;

const ColumnContainer = styled.div`
  display: flex
  flex-direction: column;
  width: 100%;
  background-color: ${(props) => props.backgroundColor};
`;

class DrawerDropDown extends React.Component {
  static defaultProps = {
    headerText: "Test Header",
    backgroundColor: "transparent",
    headerComponent: null
  };

  state = {
    isOpen: false,
  };

  handleChangeDropdownState = () => {
    this.setState({ isOpen: !this.state.isOpen })
  };

  render() {
    if(!this.state.isOpen) {
      return (
        <RowContainer backgroundColor={this.props.backgroundColor}>
          <ArrowButton onClick={this.handleChangeDropdownState}>
            <ArrowImage src="https://storage.googleapis.com/blerp_products/Twitch/Assets/Arrows/Chevron_DarkGrey_Right.svg" />
            <HeaderText>{this.props.headerText}</HeaderText>
          </ArrowButton>
          {this.props.headerComponent}
        </RowContainer>
      )
    }
  
    return (
      <ColumnContainer backgroundColor={this.props.backgroundColor}>
        <RowContainer>
          <ArrowButton onClick={this.handleChangeDropdownState}>
            <ArrowImage src="https://storage.googleapis.com/blerp_products/Twitch/Assets/Arrows/Chevron_DarkGrey_Down.svg" />
            <HeaderText>{this.props.headerText}</HeaderText>
          </ArrowButton>
          {this.props.headerComponent}
        </RowContainer>
        {this.props.children}
      </ColumnContainer>
    );
  }
}

export default DrawerDropDown;
