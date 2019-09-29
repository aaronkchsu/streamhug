import React from 'react';
import styled from 'styled-components';
import Header from '../components/HeaderWrapper';
import SearchNavBarWrapper from '../components/SearchNavBarWrapper';
import SearchBitesWrapper from '../components/SearchBitesWrapper';
import RandomBitesWrapper from '../components/RandomBitesWrapper';
import StreamerSelectedBoards from '../components/StreamerSelectedBoards';
import ScreenOverlay from '../components/ScreenOverlay';
import BlastScreenOverlay from '../components/BlastScreenOverlay';
import SubscriberScreenOverlay from '../components/SubscriberScreenOverlay';
import ViewerSidebarMenu from '../components/ViewerSidebarMenu';

import SettingsSubscriptionWrapper from '../subscriptions/SettingsSubscriptionWrapper';
import TransactionSubscription from '../subscriptions/TransactionSubscription';

import BoardPage from './board';
import gql from 'graphql-tag';
import CooldownScreenWrapper from '../components/CooldownScreenWrapper';
import BlastTutorialOverlay from '../components/BlastTutorialOverlay';

import { Query, Mutation } from 'react-apollo';
import { defaultBackground } from '../other/colors';
import { setGlobalAudioPlayerMute, setGlobalAudioPlayerVolume } from "../other/globalAudioPlayer";

import SCREENS from '../data/screens';
const IS_CONFIG = false;

import Authentication from '../util/Authentication/Authentication';

const loadingStyle = {
  headerText: '#21000C',
  fontSize: "20px",
  backgroundColor: "#F3F3F3",
  minHeight: "480px",
  width: "100%",
  height: "100%",
  textAlign: "center",
  padding: "12px"
};

const PageContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${defaultBackground};
  min-height: 200px;
  position: relative;
`;

const BitesContainer = styled.div``;

const FETCH_GLOBAL_ITEMS = gql`
  query grabGlobalItemsOnClient {
    globalScreen @client
    globalBoardId @client
    currentCountdownTime @client
    globalSearchQuery @client
    globalSendBite @client {
      id
      title
      audioUrl
      bitCount
      imageUrl
    }
    twitchChannelSettings @client {
      roomId
      isOnline
      blastPrice
    }
    globalVolumeIsMuted @client
    showBlastShareScreen @client
    isBlastEditing @client
    globalBitCost @client
    showGlobalSendBite @client
    globalCooldownTime @client
    globalCooldownActive @client
    globalMpaaRating @client
    selectedBoardIds @client
    specificBoardEnabled @client
    isSideBarMenuOpen @client
    selectedBlastBites @client {
      id
      title
      audioUrl
      imageUrl
    }
  }
`;

const FETCH_PARTY_BITES = gql`
  query twitchPartySubscriberClick($audienceRating: [AudienceRating]) {
    twitch {
      biteRandomMany(audienceRating: $audienceRating, limit: 3) {
        _id
        title
        audio {
          mp3 {
            url
          }
        }
      }
    }
  }
`;

const FETCH_GLOBAL_SHARE_BITE = gql`
  query currentSharedBite {
    twitchChannelSettings @client {
      roomId
      blastPrice
    }
    selectedBlastBites @client {
      id
      title
      audioUrl
      imageUrl
    }
    globalSearchQuery @client
    globalSendBite @client {
      id
      title
      audioUrl
      bitCount
      imageUrl
    }
  }
`;

const CLEAR_ALL_SELECTED_BLAST_BITES = gql`
  mutation twitchBlastEdit($show: boolean!) {
    setBlastEdit(show: $show) @client
  }
`;

const CLOSE_GLOBAL_SHOW_BITE = gql`
  mutation twitchCloseShowBit($show: boolean!, $biteToSend: JSON) {
    setGlobalShowBite(show: $show, biteToSend: $biteToSend) @client
  }
`;

class Page extends React.Component {
  userTransactionTimeout = null;

  constructor(props) {
    super(props);
    this.authNetwork = new Authentication();

    // If the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null.
    this.twitch = window.Twitch ? window.Twitch.ext : null;
    this.state = {
      finishedLoading: false,
      theme: 'light',
      isVisible: true,
      isAuthorized: false,
      showUserDonate: false,
      showUserCongrats: false,
      showUserCooldown: false,
      subscriptionStatus: false,
      openBlastTutorial: false,
      openSubcribeOptions: false,
      lastSelectedSubscriptionTierPurchase: false,
      viewer: null,
      user: {
        name: '',
        bitsDonated: 0,
        biteTitle: ''
      }
    };
  }

  contextUpdate(context, delta) {
    if (delta.includes('theme')) {
      this.setState(() => {
        return { theme: context.theme };
      });
    }

    if(delta.includes("isMuted")) {
      setGlobalAudioPlayerMute(context.isMuted)
    } 

    if(delta.includes("volume")) {
      setGlobalAudioPlayerVolume(context.volume)
    }
  }

  visibilityChanged(isVisible) {
    this.setState(() => {
      return {
        isVisible
      };
    });
  }

  componentDidMount() {
    if (this.twitch) {
      this.twitch.onAuthorized(async (auth) => {
        this.authNetwork.setToken(auth.token, auth.userId);
        this.setState(() => {
          return {
            finishedLoading: true,
            isAuthorized: this.authNetwork.hasSharedId(),
            subscriptionStatus: // Automatically let broadcaster send 5 consecutive blerps
              this.twitch.viewer.role === 'broadcaster'
                ? '3000'
                : (this.twitch.viewer &&
                  this.twitch.viewer.subscriptionStatus &&
                  this.twitch.viewer.subscriptionStatus.tier) || this.state.lastSelectedSubscriptionTierPurchase
          };
        });
      });

      this.twitch.actions.onSubscribe(({ didSubscribe, errorCode }) => {
        if (didSubscribe && !errorCode) {
          this.setState({
            subscriptionStatus:
            (this.twitch.viewer &&
              this.twitch.viewer.subscriptionStatus &&
              this.twitch.viewer.subscriptionStatus.tier) || this.state.lastSelectedSubscriptionTierPurchase || '1000'
          });
        }
      });

      this.twitch.onVisibilityChanged((isVisible, _c) => {
        this.visibilityChanged(isVisible);
      });

      this.twitch.onContext((context, delta) => {
        this.contextUpdate(context, delta);
      });
    }
  }

  componentWillUnmount() {
    if (this.twitch) {
      this.twitch.unlisten('broadcast', () => console.log('successfully unlistened'));
    }
  }

  onTransactionComplete = (globalSendBite, roomId, searchQuery, selectedBlastBites, mutationCall, closeGlobalBite) => async (
    transactionObject
  ) => {
    if (transactionObject && transactionObject.message === 'Not Implemented') {
      return;
    } else if (transactionObject.initiator === 'current_user') {
      if (transactionObject.product && transactionObject.product.sku.substring(0, 5) === 'blast') {
        const nonNull = selectedBlastBites.filter((bite) => !!bite);
        this.authNetwork.postPartyAction({ blastBites: nonNull, roomId: roomId, transactionObj: transactionObject });

        mutationCall({
          variables: {
            show: false
          }
        });

        this.setState({
          showUserCongrats: true,
          showUserCooldown: true
        });

        // Only log Ids
        const biteIds = nonNull.map((bite) => bite.id);
        const data = {
          selectedBiteIds: biteIds,
          shareTo: 'TWITCH_STREAM',
          transactionId: transactionObject.transactionId,
          bitsUsed:
            transactionObject.product && transactionObject.product.cost && transactionObject.product.cost.amount,
          shareUsing: 'TWITCH_BITS_TRANSACTION',
          searchQuery: this.props.searchQuery,
          twitchName: transactionObject.displayName
        };

        this.props.logAction({
          fetchPolicy: 'no-cache',
          ssr: false,
          variables: {
            action: 'SHARE_BLAST',
            data
          }
        });
      } else {
        // Only send if we are sending an actual object
        if(!globalSendBite) {
          return;
        }
        const playResponse = await this.authNetwork.postAudioUrlPlay({
          audioUrl: globalSendBite.audioUrl,
          imageUrl: globalSendBite.imageUrl,
          biteId: globalSendBite.id,
          biteTitle: globalSendBite.title,
          transactionObj: transactionObject,
          roomId
        });

        this.setUserTransaction({
          name: transactionObject.displayName,
          bitsDonated:
            transactionObject.product && transactionObject.product.cost && transactionObject.product.cost.amount,
          biteTitle: 'Donated Bits' // TODO: Use bit title
        });

        this.setState({
          showUserCongrats: true,
          showUserCooldown: true
        });

        const data = {
          id: globalSendBite.id,
          title: globalSendBite.title,
          shareTo: 'TWITCH_STREAM',
          transactionId: transactionObject.transactionId,
          bitsUsed:
            transactionObject.product && transactionObject.product.cost && transactionObject.product.cost.amount,
          transactionObject: transactionObject,
          shareUsing: 'TWITCH_BITS_TRANSACTION',
          searchQuery,
          twitchName: transactionObject.displayName
        };

        this.props.logAction({
          fetchPolicy: 'no-cache',
          ssr: false,
          variables: {
            action: 'SHARE_BLERP',
            data
          }
        });
      }
    } else {
      this.setUserTransaction({
        name: transactionObject.displayName,
        bitsDonated:
          transactionObject.product && transactionObject.product.cost && transactionObject.product.cost.amount,
        biteTitle: 'Made a bits donation!' // TODO: Use bit title
      });
    }

    // Still show the bite but clear selected
    closeGlobalBite({
      variables: {
        show: true,
        biteToSend: null
      }
    });
  };

  setCongrats = (showCongratsBoolean) => {
    this.setState({
      showUserCongrats: showCongratsBoolean
    });
  };

  onCooldownStart = () => {
    this.setState({
      showUserCooldown: true
    });
  };

  onCooldownFinished = () => {
    this.setState({
      showUserCooldown: false
    });
  };

  onTransactionCancelled = (transactionObject) => {
    if (transactionObject && transactionObject.message === 'Not Implemented') {
      return;
    }
    this.setState({
      showUserCongrats: false
    });
  };

  setUserTransaction = (user) => {
    this.setState({
      user: {
        name: user.name,
        bitsDonated: user.bitsDonated,
        biteTitle: user.biteTitle
      },
      showUserDonate: true
    });

    clearTimeout(this.userTransactionTimeout);
    this.userTransactionTimeout = setTimeout(() => {
      this.setState({ showUserDonate: false });
    }, 10000);
  };

  handleOpenShareIdentity = () => {
    this.twitch.actions.requestIdShare();
  };

  openBlastTutorial = () => {
    this.setState({ openBlastTutorial: true });
  };

  closeBlastTutorial = () => {
    this.setState({ openBlastTutorial: false });
  };

  onSubscribeOpenClick = () => {
    this.setState({ openSubcribeOptions: true });
  };

  onSubscribePurchasing = (tier) => {
    this.setState({ lastSelectedSubscriptionTierPurchase: tier, openSubcribeOptions: false }, () => {
      this.twitch.actions.subscribeToChannel({ tier });
    });
  };

  onSubscribeCancel = () => {
    this.setState({ openSubcribeOptions: false });
  };

  render() {
    if (!this.state.finishedLoading) {
      return <div style={loadingStyle}>{'Loading...'}</div>;
    }

    if (!this.state.isVisible) {
      return <div />;
    }

    const subscriptionAllowed = this.twitch && this.twitch.features.isSubscriptionStatusAvailable;
    const isStreamer = this.twitch && this.twitch.viewer.role === 'broadcaster'

    return (
      <PageContainer>
        <SettingsSubscriptionWrapper authNetwork={this.authNetwork} />
        <Mutation mutation={CLEAR_ALL_SELECTED_BLAST_BITES}>
          {(mutationCall) => (
        <Mutation mutation={CLOSE_GLOBAL_SHOW_BITE}>
          {(closeGlobalBite) => (
            <Query query={FETCH_GLOBAL_SHARE_BITE}>
              {({ data }) => {
                return (
                  <TransactionSubscription
                    onTransactionCancelled={this.onTransactionCancelled}
                    onTransactionComplete={this.onTransactionComplete(
                      data.globalSendBite,
                      data.twitchChannelSettings && data.twitchChannelSettings.roomId,
                      data.globalSearchQuery,
                      data.selectedBlastBites,
                      mutationCall,
                      closeGlobalBite
                    )}
                  />
                );
              }}
            </Query>
          )}
        </Mutation>
          )}
        </Mutation>

        <Query query={FETCH_GLOBAL_ITEMS} notifyOnNetworkStatusChange={true}>
          {({ data }) => {
            const isOnline = data.twitchChannelSettings && data.twitchChannelSettings.isOnline;

            if (data.specificBoardEnabled && data.selectedBoardIds && data.selectedBoardIds[0]) {
              if (data.globalScreen == SCREENS.board && data.globalBoardId !== '') {
                return (
                  <React.Fragment>
                    <BitesContainer>
                      <BoardPage
                        id={data.globalBoardId}
                        showUserDonate={this.state.showUserDonate}
                        user={this.state.user}
                        isOverlay={this.props.isOverlay}
                        onlyBoardsAllowed={data.specificBoardEnabled}
                        isEditingBlerpBlast={data.isBlastEditing}
                        blastPrice={data.twitchChannelSettings && data.twitchChannelSettings.blastPrice}
                        subscriptionStatus={this.state.subscriptionStatus}
                        onSubscribeClick={this.onSubscribeOpenClick}
                        openBlastTutorial={this.openBlastTutorial}
                        isBlastEditing={data.isBlastEditing}
                        subscriptionAllowed={subscriptionAllowed}
                        selectedBlastBites={data.selectedBlastBites}
                        isConfig={IS_CONFIG}
                        isLoggedIn={this.state.isAuthorized && !this.state.showUserCooldown}
                        isOnline={isOnline && !this.state.showUserCooldown}
                      />
                    </BitesContainer>
                  </React.Fragment>
                );
              }

              return (
                <React.Fragment>
                  <Header
                    showUserDonate={this.state.showUserDonate}
                    user={this.state.user}
                    headerText={data.globalVolumeIsMuted ? "Muted" : isOnline ?  'Top Blerps' : "Sharing Offline"}
                    isOverlay={this.props.isOverlay}
                    isConfig={IS_CONFIG}
                    onlyBoardsAllowed={data.specificBoardEnabled}
                    blastPrice={data.twitchChannelSettings && data.twitchChannelSettings.blastPrice}
                    subscriptionStatus={this.state.subscriptionStatus}
                    onSubscribeClick={this.onSubscribeOpenClick}
                    openBlastTutorial={this.openBlastTutorial}
                    isBlastEditing={data.isBlastEditing}
                    selectedBlastBites={data.selectedBlastBites}
                    isLoggedIn={this.state.isAuthorized}
                    subscriptionAllowed={subscriptionAllowed}
                    handleOpenShareIdentity={this.handleOpenShareIdentity}
                  />
                  <BitesContainer>
                    <StreamerSelectedBoards boardIds={data.selectedBoardIds ? data.selectedBoardIds : []} />
                  </BitesContainer>
                </React.Fragment>
              );
            } else if (data.globalScreen == SCREENS.search) {
              return (
                <React.Fragment>
                  <Header
                    showUserDonate={this.state.showUserDonate}
                    user={this.state.user}
                    headerText={data.globalSearchQuery}
                    isOverlay={this.props.isOverlay}
                    isConfig={IS_CONFIG}
                    onlyBoardsAllowed={data.specificBoardEnabled}
                    blastPrice={data.twitchChannelSettings && data.twitchChannelSettings.blastPrice}
                    subscriptionStatus={this.state.subscriptionStatus}
                    onSubscribeClick={this.onSubscribeOpenClick}
                    openBlastTutorial={this.openBlastTutorial}
                    isBlastEditing={data.isBlastEditing}
                    selectedBlastBites={data.selectedBlastBites}
                    subscriptionAllowed={subscriptionAllowed}
                    isLoggedIn={this.state.isAuthorized}
                    handleOpenShareIdentity={this.handleOpenShareIdentity}
                  />
                  <BitesContainer>
                    <SearchBitesWrapper
                      searchQuery={data.globalSearchQuery}
                      loggedIn={this.state.isAuthorized}
                      isOnline={isOnline && !this.state.showUserCooldown}
                      currentMpaaRating={data.globalMpaaRating}
                      isEditingBlerpBlast={data.isBlastEditing}
                      subscriptionStatus={this.state.subscriptionStatus}
                    />
                  </BitesContainer>
                </React.Fragment>
              );
            } else if (data.globalScreen == SCREENS.board && data.globalBoardId !== '') {
              return (
                <React.Fragment>
                  <BitesContainer>
                    <BoardPage
                      id={data.globalBoardId}
                      showUserDonate={this.state.showUserDonate}
                      user={this.state.user}
                      isLoggedIn={this.state.isAuthorized}
                      isOnline={isOnline && !this.state.showUserCooldown}
                      isOverlay={this.props.isOverlay}
                      onlyBoardsAllowed={data.specificBoardEnabled}
                      isEditingBlerpBlast={data.isBlastEditing}
                      blastPrice={data.twitchChannelSettings && data.twitchChannelSettings.blastPrice}
                      subscriptionStatus={this.state.subscriptionStatus}
                      onSubscribeClick={this.onSubscribeOpenClick}
                      openBlastTutorial={this.openBlastTutorial}
                      isBlastEditing={data.isBlastEditing}
                      selectedBlastBites={data.selectedBlastBites}
                      subscriptionAllowed={subscriptionAllowed}
                    />
                  </BitesContainer>
                </React.Fragment>
              );
            } else {
              return (
                <React.Fragment>
                  <Header
                    showUserDonate={this.state.showUserDonate}
                    user={this.state.user}
                    headerText={data.globalVolumeIsMuted ? "Muted" : isOnline ?  'Top Blerps' : "Sharing Offline"}
                    isOverlay={this.props.isOverlay}
                    isConfig={IS_CONFIG}
                    onlyBoardsAllowed={data.specificBoardEnabled}
                    blastPrice={data.twitchChannelSettings && data.twitchChannelSettings.blastPrice}
                    subscriptionStatus={this.state.subscriptionStatus}
                    onSubscribeClick={this.onSubscribeOpenClick}
                    openBlastTutorial={this.openBlastTutorial}
                    isBlastEditing={data.isBlastEditing}
                    selectedBlastBites={data.selectedBlastBites}
                    isLoggedIn={this.state.isAuthorized}
                    subscriptionAllowed={subscriptionAllowed}
                    handleOpenShareIdentity={this.handleOpenShareIdentity}
                  />
                  <BitesContainer>
                    <StreamerSelectedBoards boardIds={data.selectedBoardIds ? data.selectedBoardIds : []} />
                    <RandomBitesWrapper
                      loggedIn={this.state.isAuthorized}
                      isOnline={isOnline && !this.state.showUserCooldown}
                      currentMpaaRating={data.globalMpaaRating}
                      isEditingBlerpBlast={data.isBlastEditing}
                      subscriptionStatus={this.state.subscriptionStatus}
                    />
                  </BitesContainer>
                </React.Fragment>
              );
            }
          }}
        </Query>

        <Query query={FETCH_GLOBAL_ITEMS} notifyOnNetworkStatusChange={true}>
          {({ data }) => {
            return (
              <React.Fragment>
                <ScreenOverlay
                  blastPrice={data.twitchChannelSettings && data.twitchChannelSettings.blastPrice}
                  isBlastEditing={data.isBlastEditing}
                  showScreen={data.showGlobalSendBite}
                  showUserCongrats={this.state.showUserCongrats}
                  setCongrats={this.setCongrats}
                  showCooldown={this.onCooldownStart}
                  biteTitle={data.globalSendBite && data.globalSendBite.title}
                  biteId={data.globalSendBite && data.globalSendBite.id}
                  audioUrl={data.globalSendBite && data.globalSendBite.audioUrl}
                  imageUrl={data.globalSendBite && data.globalSendBite.imageUrl}
                  bitCount={data && data.globalBitCost}
                  authNetwork={this.authNetwork}
                  isOverlay={this.props.isOverlay}
                  roomId={data.twitchChannelSettings && data.twitchChannelSettings.roomId}
                  logAction={this.props.logAction}
                  searchQuery={data.globalSearchQuery}
                  isStreamer={isStreamer}
                />
                <BlastScreenOverlay
                  blastPrice={data.twitchChannelSettings && data.twitchChannelSettings.blastPrice}
                  isBlastEditing={data.isBlastEditing}
                  showScreen={data.showBlastShareScreen}
                  showUserCongrats={this.state.showUserCongrats}
                  setCongrats={this.setCongrats}
                  showCooldown={this.onCooldownStart}
                  imageUrl={data.globalSendBite && data.globalSendBite.imageUrl}
                  authNetwork={this.authNetwork}
                  isOverlay={this.props.isOverlay}
                  roomId={data.twitchChannelSettings && data.twitchChannelSettings.roomId}
                  logAction={this.props.logAction}
                  searchQuery={data.globalSearchQuery}
                  selectedBlastBites={data.selectedBlastBites}
                  subscriptionStatus={this.state.subscriptionStatus}
                  isStreamer={isStreamer}
                />
                <SubscriberScreenOverlay
                  blastPrice={data.twitchChannelSettings && data.twitchChannelSettings.blastPrice}
                  isBlastEditing={data.isBlastEditing}
                  showScreen={this.state.openSubcribeOptions}
                  showUserCongrats={this.state.showUserCongrats}
                  setCongrats={this.setCongrats}
                  showCooldown={this.onCooldownStart}
                  imageUrl={data.globalSendBite && data.globalSendBite.imageUrl}
                  authNetwork={this.authNetwork}
                  isOverlay={this.props.isOverlay}
                  roomId={data.twitchChannelSettings && data.twitchChannelSettings.roomId}
                  logAction={this.props.logAction}
                  searchQuery={data.globalSearchQuery}
                  selectedBlastBites={data.selectedBlastBites}
                  onSubscribeFinished={this.onSubscribePurchasing}
                  onSubscribeCancel={this.onSubscribeCancel}
                />
                <ViewerSidebarMenu
                  blastPrice={data.twitchChannelSettings && data.twitchChannelSettings.blastPrice}
                  isBlastEditing={data.isBlastEditing}
                  isMuted={data.globalVolumeIsMuted}
                  showScreen={data.isSideBarMenuOpen}
                  showUserCongrats={this.state.showUserCongrats}
                  setCongrats={this.setCongrats}
                  showCooldown={this.onCooldownStart}
                  imageUrl={data.globalSendBite && data.globalSendBite.imageUrl}
                  authNetwork={this.authNetwork}
                  isOverlay={this.props.isOverlay}
                  onSubscribeClick={this.onSubscribeOpenClick}
                  roomId={data.twitchChannelSettings && data.twitchChannelSettings.roomId}
                  logAction={this.props.logAction}
                  searchQuery={data.globalSearchQuery}
                  selectedBlastBites={data.selectedBlastBites}
                  onSubscribeCancel={this.onSubscribeCancel}
                  subscriptionStatus={this.state.subscriptionStatus}
                  subscriptionAllowed={subscriptionAllowed}
                />
                {this.state.openBlastTutorial && (
                  <BlastTutorialOverlay
                    onCloseClick={this.closeBlastTutorial}
                    showScreen={true}
                    currentTime={data.globalCooldownTime}
                  />
                )}
                {this.state.showUserCooldown && (
                  <CooldownScreenWrapper
                    onCloseClick={this.onCooldownFinished}
                    showScreen={this.state.showUserCooldown}
                    currentTime={data.globalCooldownTime}
                    currentCountdownTime={data.currentCountdownTime}
                  />
                )}
                {/* Only show for when search is enabled */}
                {!(data.specificBoardEnabled && data.selectedBoardIds && data.selectedBoardIds[0]) && (
                  <SearchNavBarWrapper searchOpen={false} />
                )}
              </React.Fragment>
            );
          }}
        </Query>
      </PageContainer>
    );
  }
}

export default Page;
