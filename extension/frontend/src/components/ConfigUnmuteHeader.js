/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import * as React from 'react';
import styled, { keyframes } from 'styled-components';

import TriangleIcon from '../icons/triangle-icon';
import LightCloseButton from '../icons/light-close-icon';

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
  pandaTeal,
  darkRedStatus,
  darkText,
  darkBlue,
  lightGray
} from '../other/colors';

const StyledCloseButton = styled(LightCloseButton)`
  width: 20px;
  height: 20px;
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

const NavContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  background-color: ${darkRedStatus};

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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: ${(props) => (props.color ? props.color : 'transparent')};
  animation: ${animateIn} 0.4s 1;
  display: flex;
  padding: 0 4px;
  height: 60px;
  width: 100%;
`;

const HorizontalContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => (props.color ? props.color : 'transparent')};
  animation: ${animateIn} 0.4s 1;
  width: 100%;
  justify-content: space-between;
`;

const SectionTextSmallCenterNoPadding = styled.div`
  text-align: center;
  font-size: 12px;
  font-weight: normal;
  color: ${flyoutBackground};
  font-weight: 600;
  width: 100%;
`;

const StyleLink = styled.a`
  font-weight: 600;
  text-align: center;
  font-size: 12px;
  line-height: 14px;
  text-decoration: underline;
  color: ${lightGray};
  white-space: nowrap;
  margin: 4px;
`;

class ConfigHeader extends React.Component {
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      closedState: false
    };
  }

  componentDidMount() {}

  handleCloseModal = () => {
    this.setState({ closedState: true });
  };

  render() {
    if (this.state.closedState) {
      return <div />;
    }
    return (
      <NavContainer>
        <HorizontalContainer color={darkRedStatus}>
          <Container color={darkRedStatus}>
            <SectionTextSmallCenterNoPadding>
              *Wanna chat? Need more help?
              <StyleLink href="https://discord.gg/ZEdqQme" target="_blank">
                {'Join our discord!'}
              </StyleLink>
              Viewers and Streamers can create blerps at
              <StyleLink href="https://blerp.com" target="_blank">
                {'Blerp.com!'}
              </StyleLink>
            </SectionTextSmallCenterNoPadding>
          </Container>
          <BackIconButton onClick={this.handleCloseModal}>
            <StyledCloseButton />
          </BackIconButton>
        </HorizontalContainer>
      </NavContainer>
    );
  }
}

export default ConfigHeader;
