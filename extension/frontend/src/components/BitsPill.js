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
  color: ${flyoutBackground};
  white-space: nowrap;
  background: ${props => (props.color ? props.color : pandaTeal)};
  border-radius: 40px;
  font-size: 14px;
  line-height: 14px;
  border: none;
  width: 89px;
  height: 32px;
`;

const PillText = styled.div`padding: 0 16px;`;

export default class BitsPill extends React.Component {
  render() {
    return (
      <Pill color={bitNumberToColor(this.props.bitNumber)}>
        <PillText>
          {`${this.props.showPlus ? "+ " : ""}${this.props.bitNumber}${this
            .props.showBitsText
            ? Number(this.props.bitNumber) === 1 ? " bit" : " bits"
            : ""}`}
        </PillText>
      </Pill>
    );
  }
}
