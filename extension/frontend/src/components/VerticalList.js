/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */
import List from "@researchgate/react-intersection-list";

import Bite from "./Bite";

import * as React from "react";
import styled from "styled-components";

const ContentContainerGrid = styled.div`
  display: grid;
  grid: minmax(auto, max-content) / repeat(auto-fill, 89px);
  grid-gap: 12px;
  padding: 0;
  justify-content: center;
`;

const AllTheBitesContainer = styled.div`
  padding-top: 24px;
  max-width: 1200px;
  min-height: 100vh;
  margin: auto;
  margin-bottom: 200px;
  padding-top: 12px;
`;

const itemsRenderer = (items, ref) => (
  <ContentContainerGrid innerRef={ref} role="region" aria-labelledby="recent">
    {items}
  </ContentContainerGrid>
);

// interface Props {
//   bites: any;
//   listLoadMore?: any;
//   prefetchLink?: any;
// }

export default class VerticalList extends React.Component {
  render() {
    return (
      <AllTheBitesContainer>
        <List
          itemCount={this.props.bites.length}
          itemsRenderer={itemsRenderer}
          onIntersection={this.props.listLoadMore}
          threshold={"60%"}
        >
          {(index, key) => {
            const bite = this.props.bites[index];
            if (bite) {
              return (
                <Bite
                  key={key}
                  id={bite._id}
                  title={bite.title}
                  audioSourceUrls={[bite.audio.mp3.url]}
                  color={bite.color}
                  image={(bite.image && bite.image.original.url) || (bite.giphy && bite.giphy.gif)}
                  favorited={bite.favorited}
                  playCount={bite.playCount}
                  prefetchLink={this.props.prefetchLink}
                  preload={true}
                  loggedIn={this.props.loggedIn}
                  subscriptionStatus={this.props.subscriptionStatus}
                  isEditingBlerpBlast={this.props.isEditingBlerpBlast}
                  isOnline={this.props.isOnline}
                />
              );
            }
          }}
        </List>
      </AllTheBitesContainer>
    );
  }
}
