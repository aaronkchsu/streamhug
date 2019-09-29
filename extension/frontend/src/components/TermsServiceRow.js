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
  darkBlue
} from "../other/colors";

const TermsServiceContainer = styled.div`
  position: relative;
  width: 100%;
  height: 40px;
  background-color: ${actionBackground};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  z-index: 100;
  border-radius: 0;
  margin-top: 24px;

  @media (min-width: 600px) {
    justify-content: center;
  }
`;

const ButtonContainer = styled.div`
  display: inline-flex;
  flex-grow: 1;

  @media (max-width: 600px) {
    position: absolute;
    visibility: hidden;
  }
`;

const ItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;

  @media (max-width: 600px) {
    justify-content: center;
  }
`;

const HeaderText = styled.div`
  font-weight: 600;
  text-align: center;
  font-size: 12px;
  line-height: 14px;
  text-decoration: none;
  color: ${secondaryText};
  white-space: nowrap;
`;

const StyleLink = styled.a`
  font-weight: 600;
  text-align: center;
  font-size: 12px;
  line-height: 14px;
  text-decoration: underline;
  color: ${darkBlue};
  white-space: nowrap;
  margin: 4px;
`;

const StyleWhiteLink = styled.a`
  font-weight: 600;
  text-align: center;
  font-size: 12px;
  line-height: 14px;
  text-decoration: underline;
  color: ${secondaryText};
  white-space: nowrap;
  margin: 4px;
`;

class TermsServiceRow extends React.Component {
  render() {
    return (
      <TermsServiceContainer>
        <ItemContainer>
          <HeaderText>{"You agree to Blerps & Twitch"}</HeaderText>
          {this.props.isOverlay ? (
            <StyleWhiteLink>{"Terms & Service"}</StyleWhiteLink>
          ) : (
            <StyleLink href="https://blerp.com/terms" target="_blank">
              {"Terms & Service"}
            </StyleLink>
          )}
        </ItemContainer>
      </TermsServiceContainer>
    );
  }
}

export default TermsServiceRow;
