/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import * as React from "react";
import styled from "styled-components";
import gql from "graphql-tag";
import { compose, graphql, Mutation, Query } from "react-apollo";

import CooldownScreenOverlay from "./CooldownScreenOverlay";

const Container = styled.div``;

const SET_GLOBAL_COOLDOWN = gql`
  mutation twitchGlobalCooldownSetActive($active: boolean) {
    setGlobalCooldownActive(active: $active) @client
  }
`;

const SET_GLOBAL_COOLDOWN_TIME = gql`
  mutation twitchGlobalCooldownSetTime($time: Int, $set: boolean) {
    setCurrentCoundownTime(time: $time, set: $set) @client
  }
`;

const FETCH_GLOBAL_ITEMS = gql`
  query grabGlobalItemsOnClient {
    currentCountdownTime @client
  }
`;

const DefaultProps = {};

export class CooldownScreenWrapper extends React.Component {
  static defaultProps = DefaultProps;
  props;
  render() {
    return (
      <Mutation mutation={SET_GLOBAL_COOLDOWN_TIME}>
        {setGlobalCooldownTime => (
        <Mutation mutation={SET_GLOBAL_COOLDOWN}>
          {setGlobalCooldown => (
            <Query query={FETCH_GLOBAL_ITEMS} notifyOnNetworkStatusChange={true}>
            {({ data }) => {
                return <CooldownScreenOverlay
                  timeToResetTo={this.props.currentTime}
                  currentCountdownTime={data.currentCountdownTime}
                  cooldownMutation={setGlobalCooldown}
                  cooldownTimeMutation={setGlobalCooldownTime}
                  onCloseClick={this.props.onCloseClick}
                  showScreen={this.props.showScreen}
                  isOverlay={this.props.isOverlay}
                />
            }}
          </Query>
          )}
        </Mutation>
        )}
      </Mutation>
    );
  }
}

export default CooldownScreenWrapper;
