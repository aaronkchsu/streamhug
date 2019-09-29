/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import * as React from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import BoardToggleItem from "./BoardToggleItem";

const DefaultProps = {};

const BOARD_LOCAL_STORAGE_ACTION = gql`
  mutation mobileBoardLocalStorageAction($board: JSON!, $action: String!) {
    boardLocalStorageAction(board: $board, action: $action) @client
  }
`;

export class BoardToggleItemWrapper extends React.Component {
  static defaultProps = DefaultProps;
  state = {
    toggleState: false
  }

  handleOnChange = mutationCall => async ({ newToggleState }) => {
    const action = newToggleState ? "SAVE" : "DELETE";
    await mutationCall({
      variables: {
        board: this.props.board,
        action
      }
    });
    this.setState({ toggleState: newToggleState })
  };

  render() {
    return (
      <Mutation mutation={BOARD_LOCAL_STORAGE_ACTION}>
        {boardLocalStorageMutation => {
          return (
            <BoardToggleItem
              onChange={this.handleOnChange(boardLocalStorageMutation)}
              toggleState={this.state.toggleState}
            />
          );
        }}
      </Mutation>
    );
  }
}

export default BoardToggleItemWrapper;
