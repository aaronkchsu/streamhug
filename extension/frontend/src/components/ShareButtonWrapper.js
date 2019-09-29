import * as React from "react";
import ShareButton from "./ShareButton";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const SET_GLOBAL_SHOW_BITE = gql`
  mutation twitchShowSendBiteScreen($show: boolean!, $biteToSend: JSON) {
    setGlobalShowBite(show: $show, biteToSend: $biteToSend) @client
  }
`;

export default class ShareButtonWrapper extends React.Component {
  shareButtonPressed = mutationCall => async () => {
    const biteToSend = {
      id: this.props.biteId,
      audioUrl: this.props.audioUrl,
      imageUrl: this.props.imageUrl,
      bitCount: this.props.bitCount,
      title: this.props.biteTitle
    };
    mutationCall({
      variables: {
        show: true,
        biteToSend
      }
    });
  };

  render() {
    return (
      <Mutation mutation={SET_GLOBAL_SHOW_BITE}>
        {globalShareMutation => (
          <ShareButton
            className={this.props.className}
            id={this.props.id}
            isFeaturedBite={false}
            onClick={this.shareButtonPressed(globalShareMutation)}
          />
        )}
      </Mutation>
    );
  }
}
