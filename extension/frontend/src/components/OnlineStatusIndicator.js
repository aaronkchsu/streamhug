/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import * as React from 'react';
import styled from 'styled-components';

import {
  bodyText,
  pandaNewTeal
} from "../other/colors";

const TextItem = styled.div`
  text-decoration: none;
  color: ${bodyText};
  font-size: 14px;
  padding: 4px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  margin: 8px;
`;

const Circle = styled.div`
  border-radius: 40px;
  margin: 8px;
  width: 8px;
  height: 8px
  background-color: ${props => props.isOnline ? pandaNewTeal : bodyText};
`;

export class OnlineStatusIndicator extends React.Component {
  static defaultProps = {
    isOnline: false
  };

  render() {
    return (
      <Container>
        <TextItem>{this.props.isOnline ? "Connected" : "Disconnected"}</TextItem>
        <Circle isOnline={this.props.isOnline} />
      </Container>
    );
  }
}

export default OnlineStatusIndicator;
