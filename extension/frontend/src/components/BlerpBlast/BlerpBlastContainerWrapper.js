import * as React from 'react';
import BlerpBlastContainer from './BlerpBlastContainer';
import gql from 'graphql-tag';

import { Mutation, Query} from 'react-apollo';

const SET_GLOBAL_SHOW_BITE = gql`
  mutation twitchBlastEdit($show: boolean!) {
    setBlastEdit(show: $show) @client
  }
`;

const FETCH_GLOBAL_ITEMS = gql`
  query grabGlobalItemsOnClient {
    selectedBlastBitesFull @client
  }
`;

export default class BlerpBlastContainerWrapper extends React.Component {
  handlBlastClick = (mutationCall) => ({ show }) => async () => {
    mutationCall({
      variables: {
        show: show
      }
    });
  };

  render() {
    return (
      <Query query={FETCH_GLOBAL_ITEMS}>
        {({ data }) => {
          return (
            <Mutation mutation={SET_GLOBAL_SHOW_BITE}>
              {(mutateShowBlastEdit) => (
                <BlerpBlastContainer
                  className={this.props.className}
                  isBlastEditing={this.props.isBlastEditing}
                  subscriptionStatus={this.props.subscriptionStatus}
                  blastPrice={this.props.blastPrice}
                  onSubscribeClick={this.props.onSubscribeClick}
                  onClickBlastEdit={this.handlBlastClick(mutateShowBlastEdit)}
                  selectedBlastBites={this.props.selectedBlastBites}
                  selectedBlastBitesFull={data.selectedBlastBitesFull}
                  openBlastTutorial={this.props.openBlastTutorial}
                />
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}
