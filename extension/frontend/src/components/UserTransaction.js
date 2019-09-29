import * as React from "react";
import styled, { keyframes } from "styled-components";
import BlerpTwitchLogo from "../icons/blerp-twitch-logo";

import ColorPill from "./ColorPill";
import BitsPill from "./BitsPill";

import {
  defaultBackground,
  flyoutBackground,
  pandaPink,
  pandaTeal,
  bitNumberToColor,
  focusState,
  secondaryText
} from "../other/colors";

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

const OverallContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  background-color: ${props =>
    props.transparent ? "transparent" : "transparent"};
  padding: 12px 0;
`;

const ColumnContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 252px;
`;

const RowContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 100%;
`;

const ProfileImage = styled(BlerpTwitchLogo)`
  height: 44px;
  width: 44px;
  margin: 8px;
`;

const ProfileBackground = styled.div`
  background-color: transparent;
  border-radius: 160px;
  opacity: 0.7;
`;

const StyledColoredPill = styled(ColorPill)`width: 148px;`;

export default class UserTransaction extends React.Component {
  render() {
    return (
      <OverallContainer transparent={this.props.transparent}>
        <ProfileBackground>
          <ProfileImage selected={this.props.logoHighlight} />
        </ProfileBackground>
        <ColumnContainer>
          {!!this.props.username ? (
            <React.Fragment>
            <RowContainer>
            <ColorPill
              textColor={secondaryText}
              backgroundColor={flyoutBackground}
              text={this.props.username ? `User: ${this.props.username}` : ""}
            />
          </RowContainer>
          <RowContainer>
            <StyledColoredPill
              textColor={flyoutBackground}
              backgroundColor={focusState}
              text={this.props.blerpTitle}
            />
            <BitsPill
              bitNumber={this.props.bitsDonated}
              showBitsText={true}
              showPlus={true}
            />
          </RowContainer>
          </React.Fragment>
          ) : <React.Fragment><RowContainer/><RowContainer/></React.Fragment>}
        </ColumnContainer>
      </OverallContainer>
    );
  }
}
