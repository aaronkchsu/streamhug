/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import * as React from "react";
import styled from "styled-components";

import HorizontalList from "../lists/HorizontalList";
import DateBlock from "./DateBlock";

import {
  bodyText,
  ligherBackground
} from "../../other/colors";

const ListContainer = styled.div`
  height: 240px;
  overflow-y: scroll;
  width: 100%;
  align-items: center;
`;

const RecentText = styled.div`
  font-size: 20px;
  padding: 12px;
  font-weight: light;
  margin: 0;
  color: ${bodyText};
`;

/*
 {"userName":"","biteId":"5b237fbafca7167a356194a0","biteTitle":"Turkey Call Sound",
 "audioUrl":"https://audio.blerp.com/audio/1a8de94f-3044-4b66-b765-29adb4725488?type=MP3",
 "bitCost":0,"channelId":"265737932","createdAt":"2018-12-13T16:22:02.633Z"}
*/
class HistoryPanel extends React.Component {
  static defaultProps = {
    historyItems: []
  };

  renderHistoryItems = historyItems => (index, key) => {
    const item = historyItems[index];

    if (item) {
      return <DateBlock key={item.date} dateTransactionItem={item} />;
    }
  };

  render() {
    if (!this.props.historyItems || this.props.historyItems.length === 0) {
      return (
        <RecentText>{"No recent blerps played yet. Engage your viewers by getting them to use blerp to play sounds!"}</RecentText>
      );
    }
    return (
      <ListContainer>
        <HorizontalList
          buttonColor={ligherBackground}
          length={this.props.historyItems.length}
          renderListItems={this.renderHistoryItems(this.props.historyItems)}
          showArrows={true}
        />
      </ListContainer>
    );
  }
}

export default HistoryPanel;
