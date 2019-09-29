import * as React from "react";
import styled from "styled-components";

import {
  pandaPink,
  flyoutBackground,
  statusColor,
  placeholderText,
  primaryText,
  bodyText,
  secondaryText,
  pandaTeal
} from "../../other/colors";

const SecondaryButton = styled.button`
  margin: 8px;
  font-weight: lighter;
  padding: 4px 12px;
  text-decoration: none;
  color: #fff;
  white-space: nowrap;
  background-color: #006BE8;
  font-size: 14px;
  line-height: 14px;
  height: 32px;
  min-width: 92px;
  border: none;

  &:focus {
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

export default SecondaryButton;
