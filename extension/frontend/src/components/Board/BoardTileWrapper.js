/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import * as React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";

import BoardTile from "./BoardTile";

const GRAB_STREAMER_BOARD = gql`
  query twitchGrabBoardStreamside($id: MongoID!) {
    twitch {
      playlistById(_id: $id) {
        _id
        title
        biteIds
        giphy {
          gif
        }
      }
    }
  }
`;

const DefaultProps = {};

export class BoardTileWrapper extends React.Component {
  static defaultProps = DefaultProps;

  render() {
    return (
      <Query
        query={GRAB_STREAMER_BOARD}
        notifyOnNetworkStatusChange={true}
        ssr={false}
        fetchPolicy={"network-only"}
        variables={{
          id: this.props.boardId
        }}
      >
        {({ data, loading }) => {
          if (!data || loading) {
            return <div />;
          }

          return (
            <BoardTile
              onClick={() => {}}
              board={data && data.twitch && data.twitch.playlistById}
            />
          );
        }}
      </Query>
    );
  }
}

export default BoardTileWrapper;
