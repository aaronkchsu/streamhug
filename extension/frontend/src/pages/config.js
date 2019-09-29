import * as React from 'react';
import styled from 'styled-components';
import BoardSelectionModal from '../components/BoardSelectionModal';
import Header from '../components/HeaderWrapper';
import TransactionSubscription from '../subscriptions/TransactionSubscription';
import SettingsSubscriptionWrapper from '../subscriptions/SettingsSubscriptionWrapper';
import VolumeSlider from '../components/VolumeSlider';
import ToggleItem from '../components/ToggleItem';
import ToggleBoardSetting from '../components/ToggleBoardSetting';
import HistoryPanel from '../components/HistoryPanel/index';
import OutsideLinkBoardRow from '../components/OutsideLinkBoardRow/index';
import SecondaryButton from '../components/buttons/SecondaryButton';
import DrawerDropdown from '../components/DrawerDropdown';
import OnlineStatusIndicator from '../components/OnlineStatusIndicator';
import ConfigHeaderWrapper from '../components/ConfigHeaderWrapper';
import ConfigUnmuteHeader from '../components/ConfigUnmuteHeader';
import EntryScreenConfig from '../components/EntryScreenConfig';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import { Rail, Slider, Handles, Tracks, Ticks } from 'react-compound-slider';
import { Handle, Track, Tick } from '../components/SliderComponents';
import { getArrayOfMpaaRatings } from '../other/mpaaRating';
import {
  BlastPriceOptions,
  BitPriceOptions
} from '../other/twitchApi';

import Authentication from '../util/Authentication/Authentication';
import SoundboardPanel from './streamer-board';

import SCREENS from '../data/screens';

const IS_OVERLAY = false;
const IS_CONFIG = true;

import {
  headerColor,
  secondaryText,
  secondaryGray,
  defaultBackground,
  flyoutBackground,
  pandaPink,
  pandaTeal,
  lightGray,
  bitNumberToColor,
  iconsInActive,
  darkBlue,
  bodyText,
  ligherBackground
} from '../other/colors';

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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: ${flyoutBackground};
  min-height: 200px;

  @media (max-width: 600px) {
    width: 100%;
    height: 100%;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${flyoutBackground};
  margin: 8px;
  padding: 8px;
  border-radius: 8px;
  width: 100%;

  @media (max-width: 520px) {
    padding: 0px;
  }
`;

const CurrentSettingText = styled.div`
  text-align: center;
  border: 2px solid ${lightGray};
  padding: 4px 8px;
  border-radius: 12px;
  color: ${(props) => (props.color ? props.color : pandaTeal)};
  font-size: 21px;
  font-weight: 600;
  margin: 8px;
  max-width: 132px;
  align-self: center;
`;

const HelpContainer = styled.div`
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  text-align: right;
  padding: 16px 8px;
`;

const ConfigHeaderText = styled.h1`
  text-align: center;
  font-size: 28px;
  padding: 4px;
  font-weight: 600;
  color: ${headerColor};
`;

const SectionTextContainer = styled.div``;

const SectionHeaderText = styled.h2`
  text-align: left;
  width: 100%;
  font-size: 18px;
  padding: 2px;
  margin: 4px;
  font-weight: 600;
  color: #000;
`;

const DisabledSectionHeaderText = styled.h2`
  text-align: left;
  width: 100%;
  font-size: 18px;
  padding: 2px;
  margin: 4px;
  font-weight: 600;
  color: ${lightGray};
`;

const DisabledSectionText = styled.div`
  text-align: left;
  font-size: 14px;
  padding: 4px;
  font-weight: 600;
  color: ${lightGray};
  width: 100%;
`;

const StyleLinkSmall = styled.a`
  font-weight: 600;
  text-align: center;
  font-size: 12px;
  line-height: 14px;
  text-decoration: underline;
  color: ${darkBlue};
  white-space: nowrap;
  margin: 4px;
  cursor: pointer;
`;

const DisabledSectionTextSmall = styled.div`
  text-align: left;
  font-size: 12px;
  padding: 6px;
  font-weight: 600;
  color: ${lightGray};
  width: 100%;
`;

const SectionText = styled.div`
  text-align: left;
  font-size: 14px;
  padding: 6px;
  font-weight: 600;
  color: ${secondaryGray};
  width: 100%;
`;

const SectionTextSmallCenter = styled.div`
  text-align: center;
  font-size: 12px;
  padding: 6px;
  font-weight: normal;
  color: ${secondaryGray};
  width: 100%;
`;

const SectionTextSmallCenterNoPadding = styled.div`
  text-align: center;
  font-size: 12px;
  font-weight: normal;
  color: ${secondaryGray};
  width: 100%;
  margin: 8px;
`;

const SectionTextSmall = styled.div`
  text-align: left;
  font-size: 12px;
  padding: 6px;
  font-weight: 600;
  color: ${secondaryGray};
  width: 100%;
`;

const RatingCurrentShowing = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 16px;
  align-self: center;
`;

const BitInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4px;
  margin: 8px 0;
`;

const SelectItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4px;
  margin: 16px 0;
`;

const BrowserSourceButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const SectionRowContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 8px;
  margin: 20px 0 8px;

  @media (min-width: 520px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80%;
`;

const BoardInputRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

const HistoryContainerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 12px;

  @media (max-width: 600px) {
    margin: 0;
  }
`;

const HistoryContainer = styled.div`
  width: 480px;
  margin: 8px;

  @media (max-width: 520px) {
    width: 400px;
  }

  @media (max-width: 360px) {
    width: 260px;
  }
`;

const BoardsContainer = styled.div`
  width: 320px;
  margin: 8px;

  @media (max-width: 520px) {
    width: 320px;
  }

  @media (max-width: 360px) {
    width: 260px;
  }
`;

const ButtonContainer = styled.div`width: 100%;display: flex; align-items: center; justify-content: center;`;

const CopyLink = styled.div`
  color: ${flyoutBackground};
  background-color: #006BE8;
  border: ${flyoutBackground} solid 2px;
  padding: 10px;
  user-select: all;
  overflow-wrap: break-word;
  border-radius: 8px;
  font-size: 10px;
  margin: 8px 0;
`;

// TODO: add other types
const AudienceRatingOptions = [
  { text: 'G', value: 'G' },
  { text: 'PG', value: 'PG' },
  { text: 'PG13', value: 'PG13' },
  { text: 'R', value: 'R' }
  // { text: "NC17", value: "NC17" },
  // { text: "NR", value: "NR" }
];

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

const sliderStyle = {
  // Give the slider some width
  position: 'relative',
  width: '80%',
  height: 80
};

const railStyle = {
  position: 'absolute',
  width: '100%',
  height: 4,
  marginTop: 35,
  borderRadius: 5,
  backgroundColor: lightGray
};

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
    twitchChannelSettings @client {
      audioBroadcastUrl
      isOnline
    }
    globalBitCost @client
    showGlobalSendBite @client
    globalCooldownTime @client
    globalCooldownActive @client
    globalMpaaRating @client
    globalBroadcastVolume @client
  }
`;

function formatDate(date) {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return day + '-' + monthNames[monthIndex] + '-' + year;
}

function convertTransactionsToDateArray(allTransactions = []) {
  if (!allTransactions || !allTransactions.length) {
    return [];
  }
  const orderedArray = allTransactions.reduce((accumulator, currentValue) => {
    const DateKey = formatDate(new Date(currentValue.createdAt));
    if (!accumulator[DateKey]) {
      accumulator[DateKey] = [ currentValue ];
      return accumulator;
    }
    accumulator[DateKey].push(currentValue);
    return accumulator;
  }, {});

  const array = Object.keys(orderedArray).map(function(key) {
    return { date: key, items: orderedArray[key] };
  });
  return array;
}

export default class ConfigPage extends React.Component {
  userTransactionTimeout = null;

  constructor(props) {
    super(props);
    this.authNetwork = new Authentication();

    // if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null.
    this.twitch = window.Twitch ? window.Twitch.ext : null;
    this.state = {
      lastPlayedPerson: '',
      lastBitDonation: '',
      finishedLoading: false,
      theme: 'light',
      isVisible: true,
      currentBitCount: 100,
      blastPrice: 100,
      currentMpaaRating: 'G',
      walkOnSetting: 'OFF',
      currentChannelCooldown: 30,
      openBrowserSource: true,
      selectedBoardIds: [],
      specificBoardEnabled: false,
      showUserDonate: false,
      showRequiredScreen: true,
      refreshedButton: false,
      testingAudio: false,
      allTransactionsOrdered: [],
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

        if (!this.state.finishedLoading) {
          try {
            // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.
            const twitchChannelSettings = await this.authNetwork.getTwitchChannelSettings();

            // now we've done the setup for the component, let's set the state to true to force a rerender with the correct data.
            this.setState(
              () => {
                return {
                  finishedLoading: true,
                  currentBitCount: twitchChannelSettings.bitCost,
                  blastPrice: twitchChannelSettings.blastPrice,
                  currentMpaaRating: twitchChannelSettings.mpaaRating,
                  walkOnSetting: twitchChannelSettings.walkOnSetting,
                  currentChannelCooldown: twitchChannelSettings.channelCooldown,
                  selectedBoardIds: twitchChannelSettings.selectedBoardIds,
                  specificBoardEnabled: twitchChannelSettings.specificBoardEnabled,
                  isChatEnabled: twitchChannelSettings.isChatEnabled
                };
              },
              async () => {
                const allTransactions = await this.authNetwork.getGlobalTransactions(20);

                const allTransactionsOrdered = convertTransactionsToDateArray(allTransactions);

                this.setState({
                  allTransactionsOrdered: allTransactionsOrdered
                });
              }
            );
          } catch (err) {
            this.setState(() => {
              return {
                finishedLoading: true
              };
            });
          }
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

  handleSelectBoard = async ({ boardIds }) => {
    this.setState({ selectedBoardIds: boardIds }, () => {
      this.postBoardSettings({
        selectedBoardIds: this.state.selectedBoardIds,
        specificBoardEnabled: this.state.specificBoardEnabled
      });
    });
  };

  clearSelectedBoards = async () => {
    this.setState({ selectedBoardIds: [] }, () => {
      this.postBoardSettings({
        selectedBoardIds: [],
        specificBoardEnabled: false // Because it will say search off if not
      });
    });
  };

  handleBoardToggle = async ({ newToggleState }) => {
    this.setState(
      {
        specificBoardEnabled: newToggleState
      },
      () => {
        this.postBoardSettings({
          selectedBoardIds: this.state.selectedBoardIds,
          specificBoardEnabled: this.state.specificBoardEnabled
        });
      }
    );
  };

  postBoardSettings = async ({ selectedBoardIds, specificBoardEnabled }) => {
    const postBoardSettingsReponse = await this.authNetwork.postBoardSettings({
      selectedBoardIds,
      specificBoardEnabled
    });
  };

  setBitPrice = async (event) => {
    this.setState({ currentBitCount: event.target.value });
    const postBitCostResponse = await this.authNetwork.postGlobalBitCost(event.target.value);
  };

  setBlastPrice = async (event) => {
    this.setState({ blastPrice: event.target.value });
    const postBitCostResponse = await this.authNetwork.postBlastPrice(event.target.value);
  };

  setChannelCooldownChange = async (channelCooldown) => {
    this.setState({ currentChannelCooldown: channelCooldown[0] });
  };

  setChannelCooldownFinal = async (channelCooldown) => {
    this.setState({ currentChannelCooldown: channelCooldown[0] });
    const postResponse = await this.authNetwork.postGlobalCooldownTime(channelCooldown[0]);
  };

  setMpaaRating = async (event) => {
    this.setState({ currentMpaaRating: event.target.value }, async () => {
      const postBitCostResponse = await this.authNetwork.postGlobalMpaaRating(this.state.currentMpaaRating);
    });
  };

  handleSetIsChatEnabled = async ({ newToggleState }) => {
    this.setState({ isChatEnabled: newToggleState });
    const postInformResponse = await this.authNetwork.postIsChatEnabled({
      isChatEnabled: newToggleState
    });
  };

  handleRefreshRoom = async () => {
    const postInformResponse = await this.authNetwork.postRoomRefresh();
    this.setState({ refreshedButton: true });
  };

  handleAudioUrl = ({ audioUrl, playInfo }) => {
    if (playInfo) {
      if (this.state.allTransactionsOrdered[0]) {
        const currentTransactions = JSON.parse(JSON.stringify(this.state.allTransactionsOrdered));
        currentTransactions[0].items = [ playInfo, ...currentTransactions[0].items ];
        this.setState({
          allTransactionsOrdered: currentTransactions
        });
      } else {
        this.setState({
          allTransactionsOrdered: [
            {
              date: formatDate(new Date(playInfo.createdAt)),
              items: [ playInfo ]
            }
          ]
        });
      }
    } else {
      // if (audioUrl) {
      //   playGlobalAudioByUrl(audioUrl);
      // }
    }
  };

  handleTestAudioClick = (roomIdUrl) => async () => {
    const roomItems = roomIdUrl.split('/');
    this.setState({ testingAudio: true });
    const playResponse = await this.authNetwork.postAudioUrlTest({ roomId: roomItems[roomItems.length - 1] });
    setTimeout(() => {
      this.setState({ testingAudio: false });
    }, 4000);
  };

  componentWillUnmount() {
    this.onTransactionComplete == null;
    this.onTransactionCancelled == null;
    if (this.twitch) {
      this.twitch.unlisten('broadcast', () => console.log('successfully unlistened'));
    }
  }

  onTransactionComplete = async (transactionObject) => {
    if (transactionObject && transactionObject.message === 'Not Implemented') {
      return;
    }
    this.setUserTransaction({
      lastPlayedPerson: transactionObject.displayName,
      lastBitDonation:
        transactionObject.product && transactionObject.product.cost && transactionObject.product.cost.amount,
      name: transactionObject.displayName,
      bitsDonated: transactionObject.product && transactionObject.product.cost && transactionObject.product.cost.amount,
      biteTitle: 'Made a bits donation!' // TODO: Use bit title
    });
  };

  onTransactionCancelled = (transactionObject) => {
    if (transactionObject && transactionObject.message === 'Not Implemented') {
      return;
    }
  };

  setUserTransaction = (user) => {
    this.setState({
      user: {
        name: user ? user.name : '',
        bitsDonated: user ? user.bitsDonated : '',
        biteTitle: user ? user.biteTitle : ''
      },
      showUserDonate: false
    });
    // HACK: Notice that the top part is going to always be false for now.. we are debating of using this again but i replaced it with transacitons

    clearTimeout(this.userTransactionTimeout);
    this.userTransactionTimeout = setTimeout(() => {
      this.setState({ showUserDonate: false });
    }, 10000);
  };

  onRequiredScreenClosed = () => {
    this.setState({ showRequiredScreen: false });
  };

  closeBrowserSourceScreen = () => {
    this.setState({ openBrowserSource: false });
  };

  render() {
    if (!this.state.finishedLoading) {
      return <div style={loadingStyle}>{''}</div>;
    }

    if (!this.state.isVisible) {
      return <div />;
    }

    const subscriptionAllowed = this.twitch && this.twitch.features.isSubscriptionStatusAvailable; // this.twitch.features.isSubscriptionStatusAvailable;

    return (
      <React.Fragment>
        <SettingsSubscriptionWrapper authNetwork={this.authNetwork} />
        <TransactionSubscription
          onTransactionCancelled={this.onTransactionCancelled}
          onTransactionComplete={this.onTransactionComplete}
        />
        <Query query={FETCH_GLOBAL_ITEMS}>
          {({ data }) => {
            return (
              <PageContainer>
                <Header
                  showUserDonate={this.state.showUserDonate}
                  user={this.state.user}
                  headerText={'Config'}
                  isOverlay={IS_OVERLAY}
                  isConfig={IS_CONFIG}
                />

                {/* {data.twitchChannelSettings && !data.twitchChannelSettings.isOnline && this.state.openBrowserSource && (
                  <EntryScreenConfig
                    onCloseClick={this.closeBrowserSourceScreen}
                    showScreen={this.state.openBrowserSource}
                    browserSourceUrl={data.twitchChannelSettings && data.twitchChannelSettings.audioBroadcastUrl}
                  />
                )} */}

                <ContentContainer>
                  <HelpContainer />
                  <ConfigHeaderText>{'Extension Settings'}</ConfigHeaderText>

                  <SectionRowContainer>
                      <SectionTextContainer>
                        <SectionHeaderText>Browser Source Url</SectionHeaderText>
                        <SectionText>{'Enter URL into streaming software to connect alert'}</SectionText>
                        <SectionTextSmall>
                         Hug overlay will trigger an alert when two streamers successfully hug
                        </SectionTextSmall>
                      </SectionTextContainer>

                      <SectionTextContainer>
                        <CopyLink>{data.twitchChannelSettings && data.twitchChannelSettings.audioBroadcastUrl}</CopyLink>

                        <BrowserSourceButtonsContainer>
                          {/* {this.state.refreshedButton ? (
                            <SecondaryButton>{'Refreshed'}</SecondaryButton>
                          ) : (
                            <SecondaryButton onClick={this.handleRefreshRoom}>{'Refresh'}</SecondaryButton>
                          )} */}
                          {this.state.testingAudio ? (
                            <SecondaryButton>{'Playing...'}</SecondaryButton>
                          ) : (
                            <SecondaryButton
                              onClick={this.handleTestAudioClick(
                                data.twitchChannelSettings && data.twitchChannelSettings.audioBroadcastUrl
                              )}
                            >
                              {'Test Source'}
                            </SecondaryButton>
                          )}
                        </BrowserSourceButtonsContainer>


                      </SectionTextContainer>

                    </SectionRowContainer>
                  
         
                </ContentContainer>
              </PageContainer>
            );
          }}
        </Query>
      </React.Fragment>
    );
  }
}
