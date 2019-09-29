import * as React from "react";
import gql from "graphql-tag";
import ConfigHeader from "./ConfigHeader";
import { Mutation } from "react-apollo";

const SET_GLOBAL_SCREEN = gql`
  mutation twitchSetGlobalScreen($screen: String!) {
    setGlobalScreen(screen: $screen) @client
  }
`;

export default class ConfigHeaderWrapper extends React.Component {
  handleScreenChangeCallback = mutationCall => screenName => {
    mutationCall({
      variables: {
        screen: screenName
      }
    });
    if (this.props.handleScreenChangeCallback) {
      this.props.handleScreenChangeCallback();
    }
  };

  render() {
    return (
      <Mutation mutation={SET_GLOBAL_SCREEN}>
        {setGlobalScreen => (
          <ConfigHeader
            isConfigShowing={this.props.isConfigShowing}
            handleScreenChangeCallback={this.handleScreenChangeCallback(
              setGlobalScreen
            )}
          />
        )}
      </Mutation>
    );
  }
}
