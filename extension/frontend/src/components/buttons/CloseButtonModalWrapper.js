import * as React from "react";
import CloseButton from "./CloseButton";
import gql from "graphql-tag";

import { Mutation } from "react-apollo";

const SET_GLOBAL_SHOW_BITE = gql`
  mutation twitchShowSendBiteScreen($show: boolean!, $biteToSend: JSON) {
    setGlobalShowBite(show: $show, biteToSend: $biteToSend) @client
  }
`;

export default class CloseButtonWrapper extends React.Component {
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
          <CloseButton
            className={this.props.className}
            onClick={this.handleCloseClick(globalShareMutation)}
          />
        )}
      </Mutation>
    );
  }
}
