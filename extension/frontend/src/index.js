import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider, Mutation } from "react-apollo";
import { initClient } from "./networking/apolloClient";
import gql from "graphql-tag";

require("intersection-observer");

const LOG_ACTION = gql`
  mutation logAction($action: String!, $data: JSON) {
    twitch {
      logAction(action: $action, data: $data) {
        success
      }
    }
  }
`;

export const renderPage = (Page, domElementIdString, props, opts) => {
  const AppRootElement = document.getElementById(domElementIdString);
  const client = initClient({}, opts ? opts : { config: false });
  ReactDOM.render(
    <ApolloProvider client={client}>
      <Mutation mutation={LOG_ACTION}>
          {LOG_ACTION_MUTATION => (<Page {...props} client={client} logAction={LOG_ACTION_MUTATION}/>)}
      </Mutation>
    </ApolloProvider>,
    AppRootElement
  );
};
