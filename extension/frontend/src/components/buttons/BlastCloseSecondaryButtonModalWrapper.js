import * as React from "react";
import SecondaryButton from "./SecondaryButton";
import gql from "graphql-tag";

import { Mutation } from "react-apollo";

const SET_GLOBAL_SHOW_BITE = gql`
  mutation twitchShowBlerpBlastShareScreen($show: boolean!) {
    showBlerpShareScreen(show: $show) @client
  }
`;

export default class BlastSecondaryButtonWrapper extends React.Component {
  handleCloseClick = (mutationCall) => async () => {
    mutationCall({
      variables: {
        show: false
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
