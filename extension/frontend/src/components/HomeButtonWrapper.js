import * as React from "react";
import gql from "graphql-tag";
import HomeButton from "./HomeButton";
import { Mutation } from "react-apollo";

const SET_GLOBAL_SCREEN = gql`
  mutation twitchSetGlobalScreen($screen: String!) {
    setGlobalScreen(screen: $screen) @client
  }
`;

export default class HomeButtonWrapper extends React.Component {
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
          <HomeButton
            handleScreenChangeCallback={this.handleScreenChangeCallback(
              setGlobalScreen
            )}
          />
        )}
      </Mutation>
    );
  }
}
