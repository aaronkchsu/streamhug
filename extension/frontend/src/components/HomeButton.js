/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import * as React from "react";
import styled, { keyframes } from "styled-components";

import { SCREENS } from "../data/screens";

import {
  bodyText
} from "../other/colors";

const BackArrow = styled.img`
  width: 24px;
  height: 24px;
  background-position: center;
`;

const BackText = styled.div`
  text-decoration: none;
  color: ${bodyText};
  font-size: 18px;
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

  @media (max-width: 600px) {
    left: 8px;
    margin: 0;
  }
`;

class HomeButton extends React.Component {
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  handleScreenChange = () => {
    this.props.handleScreenChangeCallback(SCREENS.popular);
  };

  render() {
    return (
      <ArrowButton onClick={this.handleScreenChange} href={`/`}>
        <BackArrow src="https://storage.googleapis.com/blerp-public-images/navigation/back-arrow.svg" />
        <BackText>{"Home"}</BackText>
      </ArrowButton>
    );
  }
}

export default HomeButton;
