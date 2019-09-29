import * as React from "react";
import styled from "styled-components";

import {
  pandaPink,
  flyoutBackground,
  statusColor,
  placeholderText,
  primaryText,
  bodyText,
  pandaTeal
} from "../../other/colors";

const ColorButton = styled.button`
  margin: 4px;
  font-weight: lighter;
  padding: 0;
  text-decoration: none;
  color: ${flyoutBackground};
  white-space: nowrap;
  background: ${props => (props.color ? props.color : pandaTeal)};
  border-radius: 40px;
  font-size: 14px;
  line-height: 14px;
  border: none;
  width: 89px;
  height: 32px;

  &:focus {
    border-radius: 40px;
    border: 2px solid #21cfa7 !important;
    outline: 0 !important;
    box-shadow: none !important;
  }

  &:hover {
    transition: all 0.2s ease 0s;
    opacity: 0.7;
    color: rgb(254, 41, 92);
  }

  &:active {
    color: ${flyoutBackground};
    opacity: 0.9;
    transition: all 0.2s ease 0s;
  }
`;

export default ColorButton;
