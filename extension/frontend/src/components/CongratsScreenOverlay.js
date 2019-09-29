/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import gql from 'graphql-tag';
import * as React from 'react';
import { Mutation } from 'react-apollo';
import styled, { keyframes } from 'styled-components';

import CloseButtonModalWrapper from './buttons/CloseButtonModalWrapper';

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
	secondaryText
} from '../other/colors';

const screenSizeHide = 1024;

const slideIn = keyframes`
  0% {
    opacity: 0;
  }

  25% {

  }

  50% {
  }

  75% {
  }

  100% {
    opacity: 1;
  }
`;

const slideOut = keyframes`
  0% {
    opacity: 1;
    top: 0;
  }

  25% {

  }

  50% {
  }

  75% {
  }

  100% {
    opacity: 0;
    top: ${screenSizeHide}px;
  }
`;

const ScreenContainer = styled.div`
	position: fixed;
	background-color: rgba(255, 255, 255, 0.85);
	width: 100%;
	height: 100%;
	max-height: 700px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	z-index: 1000001;
	border-radius: 0;
	visibility: ${(props) => {
		return props.showScreen ? "visible" : "hidden";
	}};
	opacity: ${(props) => {
		return props.showScreen ? 1 : 0;
	}};
	top: ${(props) => {
		return props.showScreen ? '0' : `${screenSizeHide}px`;
	}};
	animation: ${(props) => {
			return props.showScreen ? slideIn : 'none';
		}}
		0.5s 1;
	border-radius: ${(props) => (props.isOverlay ? '12px' : '0')};

	@media (min-width: 600px) {
		justify-content: center;
	}
`;

const CongratsImage = styled.img`
	width: 180px;
	align-self: center;
	white-space: nowrap;
`;

const HeaderText = styled.div`
	font-weight: 600;
	text-align: center;
	font-size: 28px;
	line-height: 28px;
	padding: 12px;
	text-decoration: none;
	color: ${secondaryText};
	white-space: nowrap;
`;

const SecondaryText = styled.div`
	font-weight: 600;
	text-align: center;
	font-size: 14px;
	line-height: 14px;
	text-decoration: none;
	color: ${(props) => (props.color ? props.color : secondaryText)};
	white-space: nowrap;
`;

const StyledCloseButton = styled(CloseButtonModalWrapper)`
  position: absolute;
  top: 16px;
  right: 16px;
`;

const SET_GLOBAL_SHOW_BITE = gql`
	mutation twitchShowSendBiteScreen($show: boolean!) {
		setGlobalShowBite(show: $show) @client
	}
`;

const SET_BLAST_CLOSE = gql`
	mutation twitchShowBlerpBlastShareScreen($show: boolean!) {
		showBlerpShareScreen(show: $show) @client
	}
`;

class CongratsScreenOverlay extends React.Component {
	handleCloseClick = (mutationCall, mutationBlast) => async () => {
		mutationCall({
			variables: {
				show: false
			}
		});
		mutationBlast({
			variables: {
				show: false
			}
		});
		if (this.props.onCloseClick) {
			this.props.onCloseClick();
		}
	};

	render() {
		return (
			<Mutation mutation={SET_BLAST_CLOSE}>
				{(mutationBlast) => (
					<Mutation mutation={SET_GLOBAL_SHOW_BITE}>
						{(globalShareMutation) => (
							<ScreenContainer
								onClick={this.handleCloseClick(globalShareMutation, mutationBlast)}
								showScreen={this.props.showScreen}
								isOverlay={this.props.isOverlay}
							>
								<StyledCloseButton />
								<CongratsImage
									src={
										'https://storage.googleapis.com/blerp_products/Twitch/Assets/Confirmation%20Screens/logo-complete.svg'
									}
								/>
								<HeaderText>{'Congrats!'}</HeaderText>
								<SecondaryText>{'You Shared a Blerp'}</SecondaryText>
							</ScreenContainer>
						)}
					</Mutation>
				)}
			</Mutation>
		);
	}
}

export default CongratsScreenOverlay;
