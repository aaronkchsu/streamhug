import * as React from "react";
import gql from "graphql-tag";
import BoardSquare from "./BoardSquare";
import { Mutation } from "react-apollo";

const SET_GLOBAL_SCREEN = gql`
  mutation messengerSetGlobalScreen($screen: String!, $id: String) {
    setGlobalScreen(screen: $screen, id: $id) @client
  }
`;

const SET_GLOBAL_QUERY = gql`
  mutation messengerSetGlobalQuery($query: String!) {
    setGlobalSearchQuery(query: $query) @client
  }
`;

export default class BoardSquareWrapper extends React.Component {
  handleScreenChangeCallback = mutationCall => (screenName, boardId) => {
    mutationCall({
      variables: {
        screen: screenName,
        id: boardId
      }
    });
    if (this.props.handleScreenChangeCallback) {
      this.props.handleScreenChangeCallback();
    }
  };

  handleQueryChangeCallback = mutationCall => searchQuery => {
    mutationCall({
      variables: {
        query: searchQuery
      }
    });
    if (this.props.handleQueryChangeCallback) {
      this.props.handleQueryChangeCallback();
    }
  };

  render() {
    return (
      <Mutation mutation={SET_GLOBAL_QUERY}>
        {setGlobalQuery => (
          <Mutation mutation={SET_GLOBAL_SCREEN}>
            {setGlobalScreen => (
              <BoardSquare
                id={this.props.id}
                title={this.props.title}
                color={this.props.color}
                imageUrl={
                  this.props.imageUrl ||
                  "https://storage.googleapis.com/blerp-main-bucket/images/default2-a89e-4a33-8a26-4fff77cd9607.png"
                }
                handleScreenChangeCallback={this.handleScreenChangeCallback(
                  setGlobalScreen
                )}
                handleQueryChangeCallback={this.handleQueryChangeCallback(
                  setGlobalQuery
                )}
              />
            )}
          </Mutation>
        )}
      </Mutation>
    );
  }
}
