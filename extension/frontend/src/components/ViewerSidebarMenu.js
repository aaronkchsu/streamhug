/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import * as React from 'react';
import ReactDOM from 'react-dom';
import styled, { keyframes } from 'styled-components';

import CongratsScreenOverlay from './CongratsScreenOverlay';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import ToggleBlank from './ToggleBlank';
import VolumeIcon from "../icons/volume-icon";


import {
  actionBackground,
  primaryText,
  flyoutBackground,
  pandaPink,
  defaultBackground,
  darkBackground,
  darkBlue,
  headerText,
  iconsActive,
  inputBorderColor,
  secondaryGray,
  pandaTeal,
  secondaryText,
  secondarySubtitleText,
  bitNumberToColor
} from '../other/colors';

import PinkButton from './buttons/PinkButton';
import CloseButton from './buttons/CloseButton';

const screenSizeHide = 1024;

const slideIn = keyframes`
  0% {
    left: ${screenSizeHide}px;
  }

  25% {

  }

  50% {
  }

  75% {
  }

  100% {
    left: 0;
  }
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }

  25% {
    opacity: 0;
  }

  50% {
  }

  75% {
  }

  100% {
    opacity: 0.5;
  }
`;

const fadeOut = keyframes`
  0% {
    opacity: 0.5;
  }

  25% {

  }

  50% {
    opacity: 0;
  }

  75% {
    opacity: 0;
  }

  100% {
    opacity: 0;
  }
`;

// NOTE: We can put in slideOut in place of none but it makes transitions weird
const ScreenContainer = styled.div`
  position: fixed;
  background-color: transparent;
  width: 100%;
  height: 100%;
  max-height: 700px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  z-index: 100000;
  border-radius: 0;
  visibility: ${(props) => {
		return props.showScreen ? "visible" : "hidden";
	}};
  opacity: ${props => {
    return props.showScreen ? 1 : 0;
  }};
  top: ${(props) => {
    return props.showScreen ? '0' : `${screenSizeHide}px`;
  }};
  animation: ${(props) => {
      return props.showScreen ? slideIn : 'none';
    }}
    0.6s 1;

  @media (min-width: 600px) {
    justify-content: center;
  }
`;

const LeftHalf = styled.div`
  width: 30%;
  height: 100%;
  background-color: ${darkBackground};
  opacity: ${(props) => {
    return props.showScreen ? 0.5 : 0;
  }};
  animation: ${(props) => {
      return props.showScreen ? fadeIn : fadeOut;
    }}
    1s 1;
`;

const RightHalf = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 70%;
  height: 100%;
  background-color: ${flyoutBackground};
  border-radius: ${(props) => (props.isOverlay ? '12px' : '0')};
`;

const ShareBitTextContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
`;

const LeftTextContainer = styled.div`
  padding: 0 8px 8px;
  text-align: left;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding: 4px;
`;

const SecondaryText = styled.div`
  font-weight: 600;
  text-align: center;
  font-size: 12px;
  line-height: 12px;
  text-decoration: none;
  color: ${(props) => (props.color ? props.color : secondaryText)};
  white-space: wrap;
  user-select: all;
`;

const SecondaryTextLink = styled.div`
  font-weight: lighter;
  text-align: center;
  font-size: 12px;
  line-height: 12px;
  text-decoration: none;
  color: ${(props) => (props.color ? props.color : secondaryText)};
  white-space: wrap;
  user-select: all;
  margin: 4px;
`;

const MainLightText = styled.div`
  font-weight: lighter;
  text-align: center;
  font-size: 16px;
  line-height: 16px;
  text-decoration: none;
  color: ${(props) => (props.color ? props.color : secondaryText)};
  white-space: wrap;
`;

const SecondaryRegularText = styled.div`
  font-weight: 600;
  text-align: center;
  font-size: 14px;
  line-height: 14px;
  text-decoration: none;
  color: ${(props) => (props.color ? props.color : secondaryText)};
  white-space: wrap;
`;

const SecondaryLightText = styled.div`
  font-weight: lighter;
  text-align: center;
  font-size: 12px;
  line-height: 16px;
  text-decoration: none;
  color: ${(props) => (props.color ? props.color : secondaryText)};
  white-space: wrap;
`;

const BorderLine = styled.div`
  border-width: 1px;
  margin: 8px;
  border-color: ${secondaryText};
  border-style: solid;
  width: 30%;
`;

const BottomHalfBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const StyledCloseButton = styled(CloseButton)`
  align-self: flex-end;
  margin: 8px;
`;

const SET_VOLUME_MUTED = gql`
  mutation twitchSetVolumeMuted($muted: Boolean!) {
    setGlobalVolumeIsMuted(muted: $muted) @client
  }
`;

const CLOSE_SIDEBAR = gql`
  mutation twitchSetOpenSideBar($willOpen: Boolean!) {
    setSidebarMenuState(willOpen: $willOpen) @client
  }
`;

const SecondaryButtonLink = styled.a`
  margin: 8px;
  font-weight: lighter;
  padding: 4px 12px;
  text-decoration: none;
  color: ${secondaryText};
  white-space: nowrap;
  background: transparent;
  border: 2px solid ${secondaryText};
  border-radius: 40px;
  font-size: 14px;

  &:focus {
    border-radius: 40px;
    border: 2px solid ${pandaTeal} !important;
    outline: 0 !important;
    box-shadow: none !important;
  }

  &:hover {
    transition: all 0.2s ease 0s;
    color: ${pandaTeal};
  }

  &:active {
    color: ${pandaTeal};
    border: 2px solid ${pandaTeal};
    transition: all 0.2s ease 0s;
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

  &:focus {
    border-radius: 8px;
    border: 2px solid #21cfa7 !important;
    outline: 0 !important;
    box-shadow: none !important;
  }
`;

class ViewerSidebarMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTier: null
    };
    this.modalRoot = props.rootNode || document.getElementById('root');
    this.el = document.createElement('div');
  }

  setCongrats = (congratsBoolean) => {
    if (this.props.setCongrats) {
      this.props.setCongrats(congratsBoolean);
    }
  };

  componentWillReceiveProps(newProps) {
    // Potentially we may want to reset showCongrats at a different spot besides when we open it again
    // However this makes the animations the least funky
    if (!this.props.showScreen && newProps.showScreen) {
      this.setCongrats(false);
    }
  }

  componentDidMount() {
    this.modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    this.modalRoot.removeChild(this.el);
    this.onTransactionComplete == null;
    this.onTransactionCancelled == null;
  }

  handleVolumeMuteCallback = (mutationCall, isCurrentlyMuted) => () => {
    mutationCall({
      variables: {
        muted: !isCurrentlyMuted
      }
    });
  };

  handleSubscribeOpen = (mutationCall) => () => {
    mutationCall({
      variables: {
        willOpen: false
      }
    });
    this.props.onSubscribeClick();
  };

  render() {
    if (this.props.showUserCongrats) {
      return ReactDOM.createPortal(
        <CongratsScreenOverlay
          showScreen={this.props.showScreen}
          onCloseClick={this.handleCloseClick}
          isOverlay={this.props.isOverlay}
        />,
        this.el
      );
    }

    return ReactDOM.createPortal(
      <ScreenContainer showScreen={this.props.showScreen}>
          <Mutation mutation={CLOSE_SIDEBAR}>
            {(mutationCall) => {
              return (
                <LeftHalf showScreen={this.props.showScreen} onClick={() => {
                  mutationCall({
                    variables: {
                      willOpen: false
                    }
                  });
                }} />
              )
            }}
        </Mutation>
        <RightHalf isOverlay={this.props.isOverlay}>
          <Mutation mutation={CLOSE_SIDEBAR}>
            {(mutationCall) => {
              return (
                <StyledCloseButton
                  onClick={() => {
                    mutationCall({
                      variables: {
                        willOpen: false
                      }
                    });
                  }}
                />
              );
            }}
          </Mutation>
          <BottomHalfBody>
            <ShareBitTextContainer>
              <MainLightText>{'Menu'}</MainLightText>
            </ShareBitTextContainer>

            {this.props.subscriptionAllowed && (
              <React.Fragment>
                <RowContainer>
                  <SecondaryText>{'Subscribe to Streamer For Extra Benefits'}</SecondaryText>
                </RowContainer>
                <RowContainer>
                <Mutation mutation={CLOSE_SIDEBAR}>
                  {(mutationCall) => {
                    return <PinkButton onClick={this.handleSubscribeOpen(mutationCall)}>{this.props.subscriptionStatus ? 'Upgrade' : 'Subscribe'}</PinkButton>;
                  }}
                </Mutation>
                </RowContainer>
                <LeftTextContainer>
                  <SecondaryLightText>
                    {'Blast up to 5 sounds back to back on stream.'}
                  </SecondaryLightText>
                </LeftTextContainer>
              </React.Fragment>
            )}

            {/* {this.props.subscriptionAllowed && (
              <React.Fragment>
                <RowContainer>
                  <SecondaryRegularText>{'Walk on sounds'}</SecondaryRegularText>
                  <ToggleBlank onChange={() => {}} toggleState={false} />
                </RowContainer>
                <LeftTextContainer>
                  <SecondaryLightText>
                    {'Enable walk on sounds to set a custom sound that plays live on stream when you join.'}
                  </SecondaryLightText>
                </LeftTextContainer>
                <Mutation mutation={CLOSE_SIDEBAR}>
                  {(mutationCall) => {
                    return <PinkButton onClick={this.handleSubscribeOpen(mutationCall)}>{'Subscribe'}</PinkButton>;
                  }}
                </Mutation>
              </React.Fragment>
            )} */}

                <BorderLine />

                <ShareBitTextContainer>
                  <SecondaryText>{'Cannot find the perfect Blerp?'}</SecondaryText>
                </ShareBitTextContainer>
                <ShareBitTextContainer>
                  <SecondaryLightText>{'Create new blerps at...'}</SecondaryLightText>
                </ShareBitTextContainer>
                <SecondaryTextLink>{'https://blerp.com/upload'}</SecondaryTextLink>
                {/* {!this.props.isOverlay ? 
                <SecondaryButtonLink href="https://blerp.com/upload" target="_blank">
                  {'Create'}
                </SecondaryButtonLink> : <SecondaryTextLink>{'https://blerp.com/upload'}</SecondaryTextLink>} */}

                <BorderLine />

                <ShareBitTextContainer>
                  <SecondaryText>{'Find top blerp streamers and tools!'}</SecondaryText>
                </ShareBitTextContainer>
                <ShareBitTextContainer>
                  <SecondaryLightText>{'Enable subscribers to set walk on sounds when joining the stream'}</SecondaryLightText>
                </ShareBitTextContainer>
                {!this.props.isOverlay ? 
                <SecondaryButtonLink href="https://blerp.com/streams" target="_blank">
                  {'Learn More'}
                </SecondaryButtonLink> : <SecondaryTextLink>{'https://blerp.com/streams'}</SecondaryTextLink>}

                <BorderLine />

                <SecondaryText>{'Volume | Matches Stream Loudness'}</SecondaryText>
          
                <Mutation mutation={SET_VOLUME_MUTED}>
                  {(mutationCall) => {
                    return (
                      <IconButton onClick={() => {
                        mutationCall({
                        variables: {
                          muted: !this.props.isMuted
                        }
                      })
                    }}> <VolumeIcon muted={this.props.isMuted}/></IconButton>
                    );
                  }}
                </Mutation>
          </BottomHalfBody>
        </RightHalf>
      </ScreenContainer>,
      this.el
    );
  }
}

export default ViewerSidebarMenu;
