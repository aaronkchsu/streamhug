import * as React from "react";
import gql from "graphql-tag";
import Header from "./Header";
import { Mutation, Query } from "react-apollo";

import { SCREENS } from "../data/screens";

const SET_GLOBAL_SCREEN = gql`
  mutation twitchSetGlobalScreen($screen: String!) {
    setGlobalScreen(screen: $screen) @client
  }
`;

const OPEN_SIDEBAR_MENU = gql`
  mutation twitchSetOpenSideBar($willOpen: Boolean!) {
    setSidebarMenuState(willOpen: $willOpen) @client
  }
`;

const SET_GLOBAL_QUERY = gql`
  mutation twitchSetGlobalQuery($query: String!) {
    setGlobalSearchQuery(query: $query) @client
  }
`;

const SET_VOLUME_MUTED = gql`
  mutation twitchSetVolumeMuted($muted: Boolean!) {
    setGlobalVolumeIsMuted(muted: $muted) @client
  }
`;

const FETCH_GLOBAL_ITEMS = gql`
  query grabGlobalHeaderItemsOnClient {
    globalBitCost @client
    globalMpaaRating @client
    globalVolumeIsMuted @client
    globalScreen @client
    isSideBarMenuOpen @client
  }
`;

export default class HeaderWrapper extends React.Component {
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

  handleOpenSideMenuCallback = (mutationCall) => () => {
    mutationCall({
      variables: {
        willOpen: true
      }
    });
  };

  handleVolumeMuteCallback = (mutationCall, isCurrentlyMuted) => () => {
    console.log("TRYING TO WORK", isCurrentlyMuted)
    mutationCall({
      variables: {
        muted: !isCurrentlyMuted
      }
    });
  };

  render() {
    return (
      <Query query={FETCH_GLOBAL_ITEMS}>
        {({ data }) => {
          return (
            <Mutation mutation={SET_GLOBAL_QUERY}>
              {setGlobalQuery => (
                <Mutation mutation={SET_GLOBAL_SCREEN}>
                  {setGlobalScreen => (
                    <Mutation mutation={OPEN_SIDEBAR_MENU}>
                      {openSideBarMutation => (
                        <Mutation mutation={SET_VOLUME_MUTED}>
                          {mutedMutation => {
                            return (
                              <Header
                                user={this.props.user}
                                showUserDonate={this.props.showUserDonate}
                                headerText={this.props.headerText}
                                handleScreenChangeCallback={this.handleScreenChangeCallback(
                                  setGlobalScreen
                                )}
                                handleQueryChangeCallback={this.handleQueryChangeCallback(
                                  setGlobalQuery
                                )}
                                handleOpenSideMenu={this.handleOpenSideMenuCallback(
                                  openSideBarMutation
                                )}
                                currentBitCount={data.globalBitCost}
                                mpaaRating={data.globalMpaaRating}
                                isOverlay={this.props.isOverlay}
                                isConfig={this.props.isConfig}
                                onlyBoardsAllowed={this.props.onlyBoardsAllowed}
                                blastPrice={this.props.blastPrice}
                                subscriptionStatus={this.props.subscriptionStatus}
                                onSubscribeClick={this.props.onSubscribeClick}
                                openBlastTutorial={this.props.openBlastTutorial}
                                isBlastEditing={this.props.isBlastEditing}
                                selectedBlastBites={this.props.selectedBlastBites}
                                isLoggedIn={this.props.isLoggedIn}
                                handleOpenShareIdentity={this.props.handleOpenShareIdentity}
                                subscriptionAllowed={this.props.subscriptionAllowed}
                                handleMutedClicked={this.handleVolumeMuteCallback(mutedMutation, data.globalVolumeIsMuted)}
                                isMuted={data.globalVolumeIsMuted}
                              />
                            );
                          }}
                        </Mutation>
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
