import * as React from "react";
import styled from "styled-components";
import gql from "graphql-tag";
import SearchNavBar from "./VideoSearchNavBar";
import { compose, graphql, Mutation, Query } from "react-apollo";

const SET_GLOBAL_SCREEN = gql`
  mutation messengerSetGlobalScreen($screen: String!) {
    setGlobalScreen(screen: $screen) @client
  }
`;

const SET_GLOBAL_QUERY = gql`
  mutation messengerSetGlobalQuery($query: String!) {
    setGlobalSearchQuery(query: $query) @client
  }
`;

export default class SearchNavBarWrapper extends React.Component {
  handleScreenChangeCallback = mutationCall => screenName => {
    mutationCall({
      variables: {
        screen: screenName
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
