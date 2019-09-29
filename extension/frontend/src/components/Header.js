/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import * as React from 'react';
import styled, { keyframes } from 'styled-components';

import { SCREENS } from '../data/screens';

import UserTransaction from './UserTransaction';
import TwitchBlerpIcon from '../icons/twitch-blerp-icon';
import BitsHeader from './BitsHeader';
import BlerpBlastContainerWrapper from './BlerpBlast/BlerpBlastContainerWrapper';
import HeaderNotLoggedIn from './HeaderNotLoggedIn';
import VolumeIcon from "../icons/volume-icon";

import {
  actionBackground,
  primaryText,
  flyoutBackground,
  pandaPink,
  defaultBackground,
  headerText,
  iconsActive,
  inputBorderColor,
  focusOutline,
  lighterGray,
  secondaryGray,
  secondaryText,
  bitNumberToColor,
  darkRedStatus,
  orangeStatus
} from '../other/colors';

const HeaderContainer = styled.div`
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  border-radius: ${(props) => (props.isOverlay ? '12px 12px 0 0' : '0')};

  @media (min-width: 600px) {
    justify-content: center;
  }
`;

const NavContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 60px;
  opacity: 0.94;
  background-color: #65AFFF;
  border-radius: ${(props) => (props.isOverlay ? '12px 12px 0 0' : '0')};

  @media (max-width: 600px) {
    justify-content: space-between;
  }
`;

const ItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  @media (max-width: 600px) {
    justify-content: center;
  }
`;

// NOTE: fix this one day and change it back to a button - height: 48px;
const BlerpIcon = styled.div`
  white-space: nowrap;
  background: transparent;
  border: none;
  opacity: 1;
  width: 32px;
  margin: 12px;
  display: flex;
  align-items: center;
  color: ${secondaryGray};

  &:focus {
    border-radius: 8px;
    border: 2px solid #21cfa7 !important;
    outline: 0 !important;
    box-shadow: none !important;
  }
`;

const IconButton = styled.button`
  white-space: nowrap;
  background: transparent;
  border: none;
  opacity: 1;
  width: 32px;
  height: 32px;
  margin: 0;
  padding: 4px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.6);
  }

  &:focus {
    border-radius: 8px;
    border: 2px solid ${pandaPink} !important;
    outline: 0 !important;
    box-shadow: none !important;
  }
`;

const IconButtonHidden = styled.button`
  white-space: nowrap;
  background: transparent;
  border: none;
  opacity: 0;
  width: 32px;
  height: 32px;
  margin: 0;
  padding: 4px;

  &:focus {
    border-radius: 8px;
    border: 2px solid ${pandaPink} !important;
    outline: 0 !important;
    box-shadow: none !important;
  }
`;

const HeaderText = styled.div`
  font-weight: 600;
  text-align: center;
  font-size: 20px;
  line-height: 24px;
  text-decoration: none;
  color: ${(props) => (props.color)};
  white-space: nowrap;
  width: 180px;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const TinyHeaderText = styled.div`
  font-weight: 600;
  text-align: center;
  font-size: 14px;
  line-height: 14px;
  text-decoration: none;
  color: ${(props) => (props.color ? props.color  : orangeStatus)};
  white-space: nowrap;
  width: 180px;
  text-overflow: ellipsis;
  overflow: hidden;
`;


const UserTransactionContainer = styled.div`background-color: ${flyoutBackground};`;

const HeaderInfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
`;

const HeaderInfoContainerVerticle = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 8px;
  text-decoration: none;
`;

const StyleLink = styled.a`
  text-decoration: none;
  color: white;
`;

const MenuIconImage = styled.img`
  width: 100%;
  height: 100%;
  align-self: center;
  white-space: nowrap;
`;

class Header extends React.Component {
  handleHomeChange = () => {
    this.props.handleQueryChangeCallback('');
    this.props.handleScreenChangeCallback(SCREENS.popular);
  };

  handleOpenSideMenu = () => {
    this.props.handleOpenSideMenu();
  };

  render() {
    return (
      <HeaderContainer isOverlay={this.props.isOverlay}>
        <NavContainer isOverlay={this.props.isOverlay}>
          <ItemContainer>
             <HeaderText color={flyoutBackground}>{"STREAM HUGS"}</HeaderText> 
          </ItemContainer>
        </NavContainer>
      </HeaderContainer>
    );
  }
}

export default Header;
