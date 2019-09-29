import React from "react";
import gql from "graphql-tag";

import SettingsSubscription from "./SettingsSubscription";
import { Mutation } from "react-apollo";

const UPDATE_CHANNEL_SETTINGS = gql`
  mutation twitchBlerpUpdateTwitchSettings($twitchChannelSettings: JSON!) {
    setTwitchChannelSettings(twitchChannelSettings: $twitchChannelSettings) @client
  }
`;

class SettingsSubscriptionWrapper extends React.Component {
  updateChannelSettings = (mutation) => (channelSettings) => { 
    mutation({
      variables: {
        twitchChannelSettings: channelSettings
      }
    });
  }

  render() {
    return (
      <Mutation mutation={UPDATE_CHANNEL_SETTINGS}>
        {updateChannelSettings => {
          return (
            <SettingsSubscription
              updateFunction={this.updateChannelSettings(updateChannelSettings)}
              authNetwork={this.props.authNetwork}
            />
          );
        }}
      </Mutation>
    );
  }
}

export default SettingsSubscriptionWrapper;

