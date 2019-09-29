/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import * as React from "react";
import styled, { keyframes } from "styled-components";

import BitesDataBlock from "./BitesDataBlock";

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
  darkBlue,
  ligherBackground
} from "../../other/colors";

const BaseHistoryBlock = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0 12px;
  height: 220px;
  align-items: center;
  justify-center: center;
  background-color: transparent;
`;

const BaseInnerHistoryBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 12px;
  height: 200px;
  background-color: ${ligherBackground};
  border-radius: 8px;
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.15);
`;

const DateContainer = styled.div`
  display:flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 109px;
  height: 100%;
  background-color: ${secondaryGray};
  border-radius: 8px 0 0 8px;
`;

const DateDay = styled.h2`
  font-size: 36px;
  font-weight: 600;
  color: ${flyoutBackground}
  padding: 0;
  margin: 0;
`;

const DateMonth = styled.h2`
  font-size: 26px;
  font-weight: normal;
  padding: 0;
  margin: 0;
  color: ${flyoutBackground};
`;

class DateBlock extends React.Component {
  static defaultProps = {
    dateTransactionItem: {
      date: null,
      items: []
    }
  };
  render() {
    const biteItems = this.props.dateTransactionItem.items.map(transaction => ({
      biteId: transaction.biteId,
      userName: transaction.userName,
      bitPrice: transaction.currentChannelBitCost
    }));

    const dateItems = this.props.dateTransactionItem.date.split("-");

    return (
      <BaseHistoryBlock key={this.props.dateTransactionItem.date}>
        <BaseInnerHistoryBlock>
          <DateContainer>
            <DateDay>{dateItems[0]}</DateDay>
            <DateMonth>{dateItems[1].substring(0, 3)}</DateMonth>
          </DateContainer>
          <BitesDataBlock biteItems={biteItems} />
        </BaseInnerHistoryBlock>
      </BaseHistoryBlock>
    );
  }
}

export default DateBlock;
