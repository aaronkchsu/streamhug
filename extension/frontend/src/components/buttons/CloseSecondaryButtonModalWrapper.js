import * as React from "react";
import SecondaryButton from "./SecondaryButton";
import gql from "graphql-tag";

import { Mutation } from "react-apollo";

const SET_GLOBAL_SHOW_BITE = gql`
  mutation twitchShowSendBiteScreen($show: boolean!, $biteToSend: JSON) {
    setGlobalShowBite(show: $show, biteToSend: $biteToSend) @client
  }
`;

export default class SecondaryButtonWrapper extends React.Component {
  handleCloseClick = (mutationCall) => async () => {
    mutationCall({
      variables: {
        show: false,
        biteToSend: null
      }
    });
    if(this.props.onClick) {
      this.props.onClick();
    }
  };

  render() {
    return (
      <Mutation mutation={SET_GLOBAL_SHOW_BITE}>
        {globalShareMutation => (
          <SecondaryButton
            className={this.props.className}
            onClick={this.handleCloseClick(globalShareMutation)}
          >
            {this.props.children}
          </SecondaryButton>
        )}
      </Mutation>
    );
  }
}
