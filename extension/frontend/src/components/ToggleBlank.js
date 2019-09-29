/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import * as React from 'react';
import styled from 'styled-components';
import Toggler from './inputs/Toggler';

const ToggleContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 8px;
`;

const DefaultProps = {};

export class ToggleItem extends React.Component {
  static defaultProps = DefaultProps;

  render() {
    return (
      <ToggleContainer>
        <Toggler onChange={this.props.onChange} toggleState={this.props.toggleState} />
      </ToggleContainer>
    );
  }
}

export default ToggleItem;
