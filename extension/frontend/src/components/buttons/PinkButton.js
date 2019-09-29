import * as React from "react";
import styled from "styled-components";

import {
  pandaTeal,
  flyoutBackground,
  statusColor,
  placeholderText,
  primaryText,
  bodyText,
  darkBlue,
  lightGray
} from "../../other/colors";

const PinkButton = styled.button`
  margin: 4px;
  font-weight: lighter;
  padding: 0;
  text-decoration: none;
  color: ${flyoutBackground};
  white-space: nowrap;
  background: ${props => props.isDisabled ? lightGray: pandaTeal};
  border-radius: 40px;
  font-size: 14px;
  line-height: 14px;
  border: none;
  width: 89px;
  height: 32px;

  &:focus {
    border-radius: 40px;
    border: 2px solid ${darkBlue} !important;
    outline: 0 !important;
    box-shadow: none !important;
  }

  &:hover {
    transition: all 0.2s ease 0s;
    background: rgb(240, 240, 240);
    color: ${pandaTeal};
  }

  &:active {
    color: rgba(150, 150, 150, 1);
    transition: all 0.2s ease 0s;
  }
`;

export const WidePinkButton = styled.button`
  margin: 8px;
  font-weight: lighter;
  padding: 0;
  text-decoration: none;
  color: ${flyoutBackground};
  white-space: nowrap;
  background-color: ${props => props.isDisabled ? lightGray: pandaTeal};
  border: 2px solid ${pandaTeal} !important;
  border-radius: 40px;
  font-size: 14px;
  line-height: 14px;
  border: none;
  width: 94%;
  padding: 12px 20px;

  &:focus {
    border-radius: 40px;
    color: ${pandaTeal};
    background-color: ${props => props.isDisabled ? lightGray: flyoutBackground};
    border: 2px solid ${pandaTeal} !important;
    outline: 0 !important;
    box-shadow: none !important;
  }

  &:hover {
    transition: all 0.2s ease 0s;
    background-color: ${props => props.isDisabled ? lightGray: flyoutBackground};
    color: ${pandaTeal};
    border: 2px solid ${pandaTeal} !important;
  }

  &:active {
    color: rgba(150, 150, 150, 1);
    background-color: #FFF4F7;
    transition: all 0.2s ease 0s;
  }
`;


export default PinkButton;
