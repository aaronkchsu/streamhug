/*
 * BLERP Inc. ("BLERP") CONFIDENTIAL
 * Copyright (c) 2018 Blerp Inc. All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import * as React from 'react';
import styled from 'styled-components';

import HorizontalList from './lists/HorizontalList';

import {
  lightGray,
  bodyText,
  disabledText,
  actionBackground,
  primaryText,
  flyoutBackground,
  pandaPink,
  defaultBackground,
  headerText,
  iconsActive,
  inputBorderColor,
  secondaryGray,
  secondaryText
} from '../other/colors';

const MegaContainer = styled.div`
  display: flex;
  padding: 12px;
  flex-flow: column;
  align-content: center;
  justify-content: center;
  visibility: visible;
`;

const ActiveDefaultIcon = styled.div`
  width: 6px;
  height: 6px;
  padding: 2px;
  margin: 0 4px;
  opacity: 1;
  background-color: ${pandaPink};
  border-radius: 40px;
`;

const InactiveDefaultIcon = styled.div`
  width: 6px;
  height: 6px;
  padding: 2px;
  margin: 0 4px;
  opacity: 1;
  background-color: ${disabledText};
  border-radius: 40px;
`;

const ActiveDefaultIconButton = styled.button`
  width: 6px;
  height: 6px;
  padding: 2px;
  margin: 0 4px;
  opacity: 1;
  background-color: ${pandaPink};
  border-radius: 40px;
`;

const InactiveDefaultIconButton = styled.button`
  width: 6px;
  height: 6px;
  padding: 2px;
  margin: 0 4px;
  opacity: 1;
  background-color: ${disabledText};
  border-radius: 40px;
`;

export default class DotsIndicator extends React.Component {
  static defaultProps = {
    selectedIndex: 1,
    numberOfSteps: 1
  };
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  onSelectItem = (index) => () => {
    this.props.onSelect(index);
  };

  renderIconItems = () => (index, key) => {
    if (this.props.clickable) {
      if (index <= this.props.selectedIndex) {
        return <ActiveDefaultIconButton key={key} onClick={this.onSelectItem(index)} />;
      } else {
        return <InactiveDefaultIconButton key={key} onClick={this.onSelectItem(index)} />;
      }
    } else if (index <= this.props.selectedIndex) {
      return <ActiveDefaultIcon key={key} onClick={this.onSelectItem(index)} />;
    } else {
      return <InactiveDefaultIcon key={key} onClick={this.onSelectItem(index)} />;
    }
  };

  render() {
    return (
      <MegaContainer>
        <HorizontalList
          length={this.props.numberOfSteps}
          renderListItems={this.renderIconItems()}
          showArrows={false}
          isCentered={true}
        />
      </MegaContainer>
    );
  }
}
