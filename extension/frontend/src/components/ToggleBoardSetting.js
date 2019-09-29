/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import * as React from "react";
import styled from "styled-components";
import Toggler from "./inputs/Toggler";

import * as colors from "../other/colors";

const OverallEmptyView = styled.div``;

const OverallView = styled.div`
  display: flex;
  flex-direction: row;
  background-color: transparent;
  align-items: center;
  justify-content: center;
`;

const ToggleContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 8px;
`;

const Title = styled.div`
  color: ${colors.darkText};
  text-align: center;
  font-size: 18px;
  padding: 4px;
  font-weight: ${props => props.isBolded ? 600 : "light"};
`;

// interface Props {
//   isOffline?: any;
//   onChange?: any;
// }
//
// interface State {
//   downloadOn: boolean;
// }

const DefaultProps = {};

export class ToggleBoardSetting extends React.Component {
  static defaultProps = DefaultProps;

  render() {
    return (
      <OverallEmptyView>
        <OverallView>
          <Title isBolded={!this.props.toggleState}>{"Recommend"}</Title>
          <ToggleContainer>
            <Toggler
              onChange={this.props.onChange}
              toggleState={this.props.toggleState}
            />
          </ToggleContainer>
          <Title isBolded={this.props.toggleState}>{"Only Show"}</Title>
        </OverallView>
      </OverallEmptyView>
    );
  }
}

export default ToggleBoardSetting;
