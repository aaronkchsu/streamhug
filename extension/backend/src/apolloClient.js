/*
 * BLERP Inc. ("BLERP") CONFIDENTIAL
 * Copyright (c) 2018 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

const { ApolloClient } = require("apollo-client");
const { ApolloLink } = require( 'apollo-link');
const { onError } = require( "apollo-link-error");
const { HttpLink } = require( "apollo-link-http");
const { InMemoryCache } = require( "apollo-cache-inmemory");
require("isomorphic-fetch");

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors)
  {
    graphQLErrors.map((args) => {
      console.log(`[GraphQL Error] ${JSON.stringify(args)}`);
    });
  }
  if (networkError) console.log(`[Network error]: ${JSON.stringify(networkError)}, Operation: ${operation.operationName}`);
});

const httpLink = new HttpLink({
  uri: "https://api.blerp.com/graphql"
});

const link = ApolloLink.from([
  errorLink,
  httpLink,
]);

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache().restore({})
});

module.exports = client;
