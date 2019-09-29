/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import gql from "graphql-tag";
import * as React from "react";
import { Query } from "react-apollo";
import styled from "styled-components";

import BiteSmall from "../BiteSmall";

import {
  actionBackground,
  primaryText,
  flyoutBackground,
  pandaPink,
  defaultBackground,
  headerText,
  iconsActive,
  inputBorderColor,
  secondaryGray,
  secondaryText,
  darkBlue,
  bitNumberToColor
} from "../../other/colors";

const getBitesForDataBlock = gql`
  query twitchGetBitesForDateBlock($ids: [MongoID]!) {
    twitch {
      biteByIds(_ids: $ids) {
        _id
        title
        keywords
        color
        image {
          original {
            url
          }
        }
        favorited
        playCount
        audienceRating
        audio {
          original {
            url
          }
          mp3 {
            url
          }
        }
      }
    }
  }
`;

const BiteRowWrapper = styled.div`
  margin: 8px;
  display: flex;
  border-radius: 0 8px 8px 0;
  align-items: center;
`;

const BiteWrapper = styled.div`position: relative;
display: flex;
align-items: center;
justify-content: center; margin: 8px;`;


const UserText = styled.div`
  position: absolute;
  top: -16px;
  left: -12px;
  text-align: left;
  font-size: 10px;
  padding: 4px;
  font-weight: 600;
  color: ${secondaryGray};
`;

const BitItemContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.color};
  padding: 4px 16px;
  border-radius: 100px;
  z-index: 10;
  pointer-events: none;
  cursor: pointer;

  @media (max-width: 600px) {
    justify-content: center;
  }
`;

const BitCountText = styled.div`
  font-weight: 600;
  text-align: center;
  font-size: 12px;
  line-height: 14px;
  text-decoration: none;
  color: ${flyoutBackground};
  white-space: nowrap;
`;


class BitesDateBlock extends React.Component {
  static defaultProps = {
    biteItems: []
  };

  render() {
    return (
      <Query
        key={Math.floor(Math.random() * Math.floor(100000000))}
        query={getBitesForDataBlock}
        notifyOnNetworkStatusChange={true}
        fetchPolicy={"network-only"}
        variables={{
          ids: this.props.biteItems.map(biteItem => biteItem.biteId)
        }}
      >
        {({ data, loading }) => {
          if (!data || loading) {
            return (
              <div key={Math.floor(Math.random() * Math.floor(100000000))}>
                {"Loading more items"}
              </div>
            );
          }

          if (data.twitch && data.twitch.biteByIds) {
            const bites = data.twitch && data.twitch.biteByIds;
            return (
              <BiteRowWrapper
                key={Math.floor(Math.random() * Math.floor(100000000))}
              >
                {this.props.biteItems.map(biteItem => {
                  // HACK: the query only returns unique ids so we have to map through the ids and find the object to generate the item
                  const bite = data.twitch.biteByIds.find(element => {
                    return element._id === biteItem.biteId;
                  });

                  // Incase a bite is not found.. this only happens when a user uses a deleted bite on accident that was not deleted from search
                  if (!bite) {
                    return <div key={Math.floor(Math.random() * Math.floor(100000000))}/>;
                  }

                  return (
                    <BiteWrapper
                      key={`${Math.floor(
                        Math.random() * Math.floor(100000000)
                      )}-${bite._id}`}
                    >
                      {biteItem.userName && (
                        <UserText>{biteItem.userName}</UserText>
                      )}
                      <BiteSmall
                        id={bite._id}
                        title={bite.title}
                        audioSourceUrls={[bite.audio.mp3.url]}
                        color={bite.color}
                        image={
                          (bite.image && bite.image.original.url) ||
                          (bite.giphy && bite.giphy.gif)
                        }
                        favorited={bite.favorited}
                        playCount={bite.playCount}
                        prefetchLink={this.props.prefetchLink}
                        preload={true}
                        loggedIn={false}
                        canLink={true}
                      />
                        {biteItem.bitPrice && <BitItemContainer color={bitNumberToColor(biteItem.bitPrice)}>
                          <BitCountText>{biteItem.bitPrice}</BitCountText>
                        </BitItemContainer>}
                    </BiteWrapper>
                  );
                })}
              </BiteRowWrapper>
            );
          } else {
            return <div />;
          }
        }}
      </Query>
    );
  }
}

export default BitesDateBlock;
