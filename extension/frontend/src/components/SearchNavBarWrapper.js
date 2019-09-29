import * as React from "react";
import gql from "graphql-tag";
import SearchNavBar from "./SearchNavBar";
import { Mutation } from "react-apollo";

const SET_GLOBAL_SCREEN = gql`
  mutation twitchSetGlobalScreen($screen: String!, $searchQuery: String!) {
    setGlobalScreen(screen: $screen, searchQuery: $searchQuery) @client
  }
`;

const SET_GLOBAL_QUERY = gql`
  mutation twitchSetGlobalQuery($query: String!) {
    setGlobalSearchQuery(query: $query) @client
  }
`;

export default class SearchNavBarWrapper extends React.Component {
  handleScreenChangeCallback = mutationCall => (screenName, searchQuery) => {
    mutationCall({
      variables: {
        screen: screenName,
        searchQuery: searchQuery ? searchQuery : ""
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
              <SearchNavBar
                searchOpen={this.props.searchOpen}
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
