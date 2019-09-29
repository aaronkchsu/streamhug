import React from "react";
import styled from "styled-components";
import Header from "../components/HeaderWrapper";
import SearchNavBarWrapper from "../components/SearchNavBarWrapper";
import SearchBitesWrapper from "../components/SearchBitesWrapper";
import RandomBitesWrapper from "../components/RandomBitesWrapper";
import ScreenOverlay from "../components/ScreenOverlay";
import BoardPage from "./board";
import gql from "graphql-tag";
import CooldownScreenWrapper from "../components/CooldownScreenWrapper";
import StreamerSelectedBoards from "../components/StreamerSelectedBoards";
import DrawerDropdown from '../components/DrawerDropdown';
import ConfigHeaderWrapper from '../components/ConfigHeaderWrapper';
import OnlineStatusIndicator from '../components/OnlineStatusIndicator';

import { Query } from "react-apollo";
import { defaultBackground, secondaryGray, darkBlue } from "../other/colors";

import SCREENS from "../data/screens";
const IS_OVERLAY = false;
const IS_CONFIG = true;


const PageContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${defaultBackground};
  min-height: 200px;

  @media (max-width: 600px) {
    width: 100%;
    height: 100%;
  }
`;

const BitesContainer = styled.div``;

const FETCH_GLOBAL_ITEMS = gql`
  query grabGlobalItemsOnClient {
    globalScreen @client
    globalBoardId @client
    globalSearchQuery @client
    globalSendBite @client {
      id
      title
      audioUrl
      bitCount
      imageUrl
    }
    globalBitCost @client
    showGlobalSendBite @client
    globalCooldownTime @client
    globalCooldownActive @client
    globalMpaaRating @client
    selectedBoardIds @client
  }
`;

const SectionTextSmallCenterNoPadding = styled.div`
  text-align: center;
  font-size: 12px;
  font-weight: normal;
  color: ${secondaryGray};
  width: 100%;
`;

const StyleLink = styled.a`
  font-weight: 600;
  text-align: center;
  font-size: 12px;
  line-height: 14px;
  text-decoration: underline;
  color: ${darkBlue};
  white-space: nowrap;
  margin: 4px;
`;

export default class Page extends React.Component {
  userTransactionTimeout = null;

  constructor(props) {
    super(props);
    this.state = {
      theme: props.theme,
      isVisible: props.isVisible,
      showUserDonate: false,
      showUserCongrats: false,
      showUserCooldown: false,
      user: {
        name: "",
        bitsDonated: 0,
        biteTitle: ""
      }
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  setCongrats = showCongratsBoolean => {
    this.setState({
      showUserCongrats: showCongratsBoolean
    });
  };

  onCooldownStart= () => {
    this.setState({
      showUserCooldown: true
    });
  };

  onCooldownFinished = () => {
    this.setState({
      showUserCooldown: false
    });
  };

  render() {
    const isLoggedIn = this.props.showShareButtons;
    return (
      <PageContainer>
        <ConfigHeaderWrapper isConfigShowing={false}/>
        <Query query={FETCH_GLOBAL_ITEMS}>
          {({ data }) => {
            if (data.globalScreen == SCREENS.search) {
              return (
                <React.Fragment>
                  <Header
                    showUserDonate={this.state.showUserDonate}
                    user={this.state.user}
                    headerText={data.globalSearchQuery}
                    isOverlay={IS_OVERLAY}
                    isConfig={IS_CONFIG}
                  />
                  <BitesContainer>
                    <SearchBitesWrapper
                      searchQuery={data.globalSearchQuery}
                      loggedIn={isLoggedIn && !this.state.showUserCooldown}
                      currentMpaaRating={data.globalMpaaRating}
                    />
                  </BitesContainer>
                  {this.state.showUserCooldown && (
                    <CooldownScreenWrapper
                      onCloseClick={this.onCooldownFinished}
                      showScreen={true}
                      currentTime={data.globalCooldownTime}
                    />
                  )}
                  <ScreenOverlay
                    showScreen={data.showGlobalSendBite}
                    showUserCongrats={this.state.showUserCongrats}
                    setCongrats={this.setCongrats}
                    showCooldown={this.onCooldownStart}
                    biteTitle={data.globalSendBite && data.globalSendBite.title}
                    biteId={data.globalSendBite && data.globalSendBite.id}
                    audioUrl={
                      data.globalSendBite && data.globalSendBite.audioUrl
                    }
                    imageUrl={
                      data.globalSendBite && data.globalSendBite.imageUrl
                    }
                    bitCount={data && data.globalBitCost}
                    authNetwork={this.props.authNetwork}
                    isOverlay={IS_OVERLAY}
                  />
                </React.Fragment>
              );
            } else if (
              data.globalScreen == SCREENS.board &&
              data.globalBoardId !== ""
            ) {
              return (
                <React.Fragment>
                  <BitesContainer>
                    <BoardPage
                      id={data.globalBoardId}
                      showUserDonate={this.state.showUserDonate}
                      user={this.state.user}
                      loggedIn={isLoggedIn && !this.state.showUserCooldown}
                      isConfig={IS_CONFIG}
                    />
                  </BitesContainer>
                  {this.state.showUserCooldown && (
                    <CooldownScreenWrapper
                      onCloseClick={this.onCooldownFinished}
                      showScreen={true}
                      currentTime={data.globalCooldownTime}
                    />
                  )}
                  <ScreenOverlay
                    showScreen={data.showGlobalSendBite}
                    showUserCongrats={this.state.showUserCongrats}
                    setCongrats={this.setCongrats}
                    showCooldown={this.onCooldownStart}
                    biteTitle={data.globalSendBite && data.globalSendBite.title}
                    biteId={data.globalSendBite && data.globalSendBite.id}
                    audioUrl={
                      data.globalSendBite && data.globalSendBite.audioUrl
                    }
                    imageUrl={
                      data.globalSendBite && data.globalSendBite.imageUrl
                    }
                    bitCount={data && data.globalBitCost}
                    authNetwork={this.props.authNetwork}
                    isOverlay={IS_OVERLAY}
                  />
                </React.Fragment>
              );
            } else {
              return (
                <React.Fragment>
                  <Header
                    showUserDonate={this.state.showUserDonate}
                    user={this.state.user}
                    headerText={"Top Blerps"}
                    isOverlay={IS_OVERLAY}
                    isConfig={IS_CONFIG}
                  />
                  <BitesContainer>
                    <StreamerSelectedBoards boardIds={data.selectedBoardIds ? data.selectedBoardIds : []}/>
                    <RandomBitesWrapper
                      loggedIn={isLoggedIn && !this.state.showUserCooldown}
                      currentMpaaRating={data.globalMpaaRating}
                    />
                  </BitesContainer>
                  {this.state.showUserCooldown && (
                    <CooldownScreenWrapper
                      onCloseClick={this.onCooldownFinished}
                      showScreen={true}
                      currentTime={data.globalCooldownTime}
                    />
                  )}
                  <ScreenOverlay
                    showScreen={data.showGlobalSendBite}
                    showUserCongrats={this.state.showUserCongrats}
                    setCongrats={this.setCongrats}
                    showCooldown={this.onCooldownStart}
                    biteId={data.globalSendBite && data.globalSendBite.id}
                    biteTitle={data.globalSendBite && data.globalSendBite.title}
                    audioUrl={
                      data.globalSendBite && data.globalSendBite.audioUrl
                    }
                    imageUrl={
                      data.globalSendBite && data.globalSendBite.imageUrl
                    }
                    bitCount={data && data.globalBitCost}
                    authNetwork={this.props.authNetwork}
                    isOverlay={IS_OVERLAY}
                  />
                </React.Fragment>
              );
            }
          }}
        </Query>
        <SearchNavBarWrapper searchOpen={false} />
      </PageContainer>
    );
  }
}
