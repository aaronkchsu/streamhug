import * as React from 'react';
import BlerpBlastEdit from './BlerpBlastEdit';
import gql from 'graphql-tag';
import { subscriberTiers, getNumberOfBitesForTier, getCurrentTier } from '../../other/subscriberHelper';

import { Mutation, Query } from 'react-apollo';

const SHOW_BLERP_BLAST_SHARE_SCREEN = gql`
  mutation twitchShowBlerpBlastShareScreen($show: boolean!) {
    showBlerpShareScreen(show: $show) @client
  }
`;

const CLEAR_BLERP_BLAST_SHARE_SCREEN = gql`
  mutation twitchClearBlerpBlast($clear: boolean!) {
    clearSelectedBlastBites(clear: $clear) @client
  }
`;

const BLERP_BLAST_REMOVE_BITE_BY_INDEX = gql`
  mutation twitchRemoveBiteByIndex($index: Int!) {
    removeBlastedBiteByIndex(index: $index) @client
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

export default class BlerpBlastEditWrapper extends React.Component {
  clearSelectedBites = (mutationCall) => ({ clear }) => async () => {
    mutationCall({
      variables: {
        clear: clear
      }
    });
  };

  handleRemoveBite = (mutationCall) => ({ index }) => async () => {
    mutationCall({
      variables: {
        index: index
      }
    });
  };

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
            <Mutation mutation={CLEAR_BLERP_BLAST_SHARE_SCREEN}>
              {(clearSelectedBitesMutation) => (
                <Mutation mutation={SHOW_BLERP_BLAST_SHARE_SCREEN}>
                  {(mutateShowBlastShareScreen) => (
                    <Mutation mutation={BLERP_BLAST_REMOVE_BITE_BY_INDEX}>
                      {(removeBiteByIndex) => (
                        <BlerpBlastEdit
                          className={this.props.className}
                          selectedBites={this.props.selectedBites}
                          removeBiteByIndex={this.handleRemoveBite(removeBiteByIndex)}
                          onSendClick={this.handleShowBlastScreenClick(mutateShowBlastShareScreen)}
                          selectedBlastBites={data.selectedBlastBites}
                          maxSelectionNumber={getNumberOfBitesForTier(this.props.subscriptionStatus)}
                          clearSelectedBites={this.clearSelectedBites(clearSelectedBitesMutation)}
                        />
                      )}
                    </Mutation>
                  )}
                </Mutation>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}
