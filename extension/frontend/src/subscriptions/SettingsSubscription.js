import React from "react";
import { subscribeToTwitchChannelSettings } from "../networking";

class SettingsSubscription extends React.Component {
  async componentDidMount() {
    if (this.props.authNetwork) {
      const twitchSettings = await this.props.authNetwork.getTwitchChannelSettings();
      this.props.updateFunction(twitchSettings);
    }


    subscribeToTwitchChannelSettings(twitchSettings => {
      this.props.updateFunction(twitchSettings);
    });
  }

  render() {
    return <div />;
  }
}

export default SettingsSubscription;
