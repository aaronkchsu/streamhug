import * as React from 'react';
import BlerpBlastPreview from './BlerpBlastPreview';
import gql from 'graphql-tag';
import { subscriberTiers, getNumberOfBitesForTier, getCurrentTier } from '../../other/subscriberHelper';

import { Mutation, Query } from 'react-apollo';

const SHOW_BLERP_BLAST_SHARE_SCREEN = gql`
  mutation twitchShowBlerpBlastShareScreen($show: boolean!) {
    showBlerpShareScreen(show: $show) @client
  }
`;

const BLERP_BLAST_REMOVE_BITE_BY_INDEX = gql`
  mutation twitchRemoveBiteByIndex($index: Int!, $maxSelectionNumber: Int!) {
    removeBlastedBiteByIndex(index: $index, maxSelectionNumber: $maxSelectionNumber) @client
  }
`;

const FETCH_GLOBAL_ITEMS = gql`
  query grabGlobalItemsOnClient {
    selectedBlastBites @client {
      id
      title
      audioUrl
      imageUrl
    }
  }
`;

export default class BlerpBlastPreviewWrapper extends React.Component {
  handleShowBlastScreenClick = (mutationCall) => async () => {
    mutationCall({
      variables: {
        show: true
      }
    });
  };

  render() {
    return (
      <Query query={FETCH_GLOBAL_ITEMS}>
        {({ data }) => {
          return (
            <Mutation mutation={SHOW_BLERP_BLAST_SHARE_SCREEN}>
              {(mutateShowBlastShareScreen) => (
                <BlerpBlastPreview
                  className={this.props.className}
                  selectedBites={this.props.selectedBites}
                  onSendClick={this.handleShowBlastScreenClick(mutateShowBlastShareScreen)}
                  selectedBlastBites={data.selectedBlastBites}
                  maxSelectionNumber={getNumberOfBitesForTier(this.props.subscriptionStatus)}
                />
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}
