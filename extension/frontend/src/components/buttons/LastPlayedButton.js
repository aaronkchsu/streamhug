import * as React from "react";
import styled from "styled-components";

import {
  pandaPink,
  pandaTeal,
  flyoutBackground,
  statusColor,
  placeholderText,
  primaryText,
  bodyText,
  secondaryText,
  defaultBackground,
  secondaryGray
} from "../../other/colors";

const Button = styled.button`
  margin: 8px;
  font-weight: lighter;
  padding: 20px;
  text-decoration: none;
  color: ${secondaryText};
  white-space: nowrap;
  background-color: ${(props) => props.isDisabled ? defaultBackground : flyoutBackground};
  border: 2px solid ${secondaryText};
  border-radius: 20px;
  font-size: 14px;
  line-height: 14px;
  width: 80%;
  height: 60px;
  opacity: ${(props) => props.isDisabled ? 0.5 : 1};

  &:focus {
    border-radius: 20px;
    border: 2px solid #21CFA7 !important;
    outline: 0 !important;
    box-shadow: none !important;
  }

  &:hover {
    transition: all 0.2s ease 0s;
    color: ${secondaryGray};
    opacity: ${(props) => props.isDisabled ? 0.5 : 0.7};
  }

  &:active {
    color: ${(props) => props.isDisabled ? secondaryText : pandaTeal};
    border: 2px solid ${(props) => props.isDisabled ? secondaryText : pandaTeal};
    background-color: ${(props) => props.isDisabled ? defaultBackground : flyoutBackground};
    transition: all 0.2s ease 0s;
    opacity: ${(props) => props.isDisabled ? 0.5 : 0.8};
  }
`;

class LastPlayedButton extends React.Component {
  render() {
    return (
      <Button onClick={this.props.onClick} isDisabled={this.props.isDisabled}>
        {this.props.isDisabled ? "Audio Disabled (Unmute top right)" : this.props.hasLastPlayed ? "Replay Most Recent Blerp" : "No Blerp Played Yet.."}
      </Button>
    );
  }
}

export default LastPlayedButton;
