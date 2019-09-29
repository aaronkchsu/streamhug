/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import * as React from "react";
import styled from "styled-components";

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
  secondaryText,
  bitNumberToColor
} from "../other/colors";

const ProfileBiteContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 133px;
  height: 133px;
  flex-direction: column;
  flex-wrap: wrap;
`;

const BackgroundImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 127px;
  height: 127px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border-radius: 100px;
  border-color: ${props => props.color};
  border-width: 3px;
  border-style: solid;

  $:invalid {
    background-color: pink;
  }
`;

const BitItemContainer = styled.div`
  position: absolute;
  bottom: -12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.color};
  padding: 8px 16px;
  border-radius: 100px;
  z-index: 10;

  @media (max-width: 600px) {
    justify-content: center;
  }
`;

const BitCountText = styled.div`
  font-weight: 600;
  text-align: center;
  font-size: 12px;
  line-height: 14px;
  text-decoration: none;
  color: ${flyoutBackground};
  white-space: nowrap;
`;

class BiteBitProfile extends React.Component {
  hideErrorImage(i) {
    i.target.src =
      "https://storage.googleapis.com/blerp-main-bucket/images/default2-a89e-4a33-8a26-4fff77cd9607.png";
  }

  render() {
    return (
      <ProfileBiteContainer className={this.props.className}>
        <BackgroundImage
          src={
            this.props.imageUrl ||
            "https://storage.googleapis.com/blerp-main-bucket/images/default2-a89e-4a33-8a26-4fff77cd9607.png"
          }
          color={bitNumberToColor(this.props.bitCount)}
          alt=""
          onError={this.hideErrorImage}
        />
        <BitItemContainer color={bitNumberToColor(this.props.bitCount)}>
          <BitCountText>{this.props.bitCount}</BitCountText>
        </BitItemContainer>
      </ProfileBiteContainer>
    );
  }
}

export default BiteBitProfile;
