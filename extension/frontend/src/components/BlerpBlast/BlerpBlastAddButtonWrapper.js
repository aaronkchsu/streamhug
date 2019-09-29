import * as React from 'react';
import BlerpBlastAddButton from './BlerpBlastAddButton';
import gql from 'graphql-tag';
import { getNumberOfBitesForTier } from '../../other/subscriberHelper';

import { Mutation } from 'react-apollo';

const ADD_SELECTED_BITE = gql`
  mutation twitchAddBlastBite($bite: JSON!, $maxSelectionNumber: Int!) {
    selectBlastedBite(bite: $bite, maxSelectionNumber: $maxSelectionNumber) @client
  }
`;

export default class BlerpBlastAddButtonWrapper extends React.Component {
  handleBlastClick = (mutationCall) => async () => {
    mutationCall({
      variables: {
        bite: this.props.bite,
        maxSelectionNumber: getNumberOfBitesForTier(this.props.subscriptionStatus)
      }
    });
  };

  render() {
    return (
      <Mutation mutation={ADD_SELECTED_BITE}>
        {(mutateShowBlastEdit) => <BlerpBlastAddButton onClick={this.handleBlastClick(mutateShowBlastEdit)} />}
      </Mutation>
    );
  }
}
