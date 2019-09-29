import * as React from "react";
import styled from "styled-components";

import {
  pandaPink,
  flyoutBackground,
  statusColor,
  placeholderText,
  primaryText,
  bodyText,
  pandaTeal,
  bitNumberToColor
} from "../other/colors";

const Pill = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
  margin: 4px;
  font-weight: lighter;
  padding: 0;
  text-decoration: none;
  white-space: nowrap;
  background: ${props => (props.color ? props.color : flyoutBackground)};
  border-radius: 40px;
  font-size: 14px;
  line-height: 14px;
  border: none;
  width: 100%;
  height: 32px;
`;

const PillText = styled.div`
  text-overflow: ellipsis;
  width: 132px;
  overflow: hidden;
  color: ${props => (props.color ? props.color : bodyText)};
  padding: 0 16px;
`;

export default class ColorPill extends React.Component {
  render() {
    return (
      <Pill className={this.props.className} color={this.props.backgroundColor}>
        <PillText color={this.props.textColor}>{this.props.text}</PillText>
      </Pill>
    );
  }
}
