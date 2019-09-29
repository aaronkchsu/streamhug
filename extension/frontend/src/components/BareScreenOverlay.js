/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import * as React from "react";
import ReactDOM from "react-dom";
import { ChildProps, graphql } from "react-apollo";
import { Helmet } from "react-helmet";
import styled, { keyframes } from "styled-components";

import { SCREENS } from "../data/screens";

import TermsServiceRow from "./TermsServiceRow";
import BiteBitProfile from "./BiteBitProfile";

import {
  actionBackground,
  primaryText,
  flyoutBackground,
  pandaPink,
  defaultBackground,
  darkBackground,
  headerText,
  iconsActive,
  inputBorderColor,
  secondaryGray,
  secondaryText,
  secondarySubtitleText,
  bitNumberToColor
} from "../other/colors";

import PinkButton from "./buttons/PinkButton";
import SecondaryButton from "./buttons/SecondaryButton";
import CloseButton from "./buttons/CloseButton";

const slideIn = keyframes`
  0% {
    opacity: 0;
    top: 400px;
  }

  25% {

  }

  50% {
  }

  75% {
  }

  100% {
    opacity: 1;
    top: 0;
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
    top: 400px;
  }
`;

const ScreenContainer = styled.div`
  position: fixed;
  background-color: transparent;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100000;
  border-radius: 0;
  visibility: ${(props) => {
		return props.showScreen ? "visible" : "hidden";
	}};
	opacity: ${(props) => {
		return props.showScreen ? 1 : 0;
	}};
  top: ${props => {
    props.showScreen ? "0" : "400px";
  }};
  animation: ${(props) => { props.showScreen ? slideIn : slideOut}} 0.2s 1;

  @media (min-width: 600px) {
    justify-content: center;
  }
`;

const TopHalf = styled.div`
  width: 100%;
  height: 30%;
  background-color: ${darkBackground};
  opacity: 0.5;
`;

const BottomHalf = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 70%;
  background-color: ${flyoutBackground};
`;

const HeaderText = styled.div`
  font-weight: 600;
  text-align: center;
  font-size: 20px;
  line-height: 20px;
  text-decoration: none;
  color: ${secondaryText};
  white-space: nowrap;
`;

const ShareBitTextContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
`;

const SecondaryText = styled.div`
  font-weight: 600;
  text-align: center;
  font-size: 16px;
  line-height: 12px;
  text-decoration: none;
  color: ${props => (props.color ? props.color : secondaryText)};
  white-space: nowrap;
`;

const BorderLine = styled.div`
  border-width: 1px;
  margin: 16px;
  width: 90%;
`;

const StyledBiteBitProfile = styled(BiteBitProfile)`
  position: absolute;
  top: 15%;
`;

const BottomHalfBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 40px;
`;

const StyledCloseButton = styled(CloseButton)`align-self: flex-end;`;

class BareScreenOverlay extends React.Component {
  constructor(props) {
    super(props);
    this.modalRoot =
      props.rootNode || document.getElementById("blerp-modal-root");
    this.el = document.createElement("div");
  }

  componentDidMount() {
    this.modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    this.modalRoot.removeChild(this.el);
  }

  handleCloseClick = () => {

  }

  handleShareClick = () => {

  }

  render() {
    return ReactDOM.createPortal(
      <ScreenContainer showScreen={this.props.showScreen}>
        <TopHalf />
        <BottomHalf>
          <TermsServiceRow />
        </BottomHalf>
      </ScreenContainer>,
      this.el
    );
  }
}

export default BareScreenOverlay;
