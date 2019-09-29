import * as React from "react";
import styled, { keyframes } from "styled-components";
import TransactionSubscription from "../subscriptions/TransactionSubscription";

import Authentication from "../util/Authentication/Authentication";
import UserTransaction from "../components/UserTransaction";

const IS_OVERLAY = true;
const IS_CONFIG = false;

import {
  defaultBackground,
  flyoutBackground,
  pandaPink,
  pandaTeal,
  bitNumberToColor,
  focusState,
  secondaryText
} from "../other/colors";

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }

  25% {
    opacity: 0;
  }

  50% {
  }

  75% {
  }

  100% {
    opacity: 0.5;
  }
`;

const fadeOut = keyframes`
  0% {
    opacity: 0.5;
  }

  25% {

  }

  50% {
    opacity: 0;
  }

  75% {
    opacity: 0;
  }

  100% {
    opacity: 0;
  }
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: transparent;
  animation: ${props => {
      return props.showScreen ? fadeIn : fadeOut;
    }}
    1s 1;
`;

export default class Page extends React.Component {
  userTransactionTimeout = null;
  constructor(props) {
    super(props);
    this.authNetwork = new Authentication();

    //if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null.
    this.twitch = window.Twitch ? window.Twitch.ext : null;
    this.state = {
      finishedLoading: false,
      theme: "light",
      isVisible: true,
      currentBitCount: 100,
      showUserDonate: false,
      user: {
        name: "",
        bitsDonated: 0,
        biteTitle: ""
      }
    };
  }

  contextUpdate(context, delta) {
    if (delta.includes("theme")) {
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
      this.twitch.onAuthorized(auth => {
        this.authNetwork.setToken(auth.token, auth.userId);

        if (!this.state.finishedLoading) {
          // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.
          this.authNetwork.postGlobalBitCost(this.state.currentBitCount);

          // now we've done the setup for the component, let's set the state to true to force a rerender with the correct data.
          this.setState(() => {
            return { finishedLoading: true };
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

  setUserTransaction = user => {
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

  onTransactionComplete = async transactionObject => {
    if (transactionObject && transactionObject.message === "Not Implemented") {
      return;
    }
    this.setUserTransaction({
      name: transactionObject.displayName,
      bitsDonated:
        transactionObject.product &&
        transactionObject.product.cost &&
        transactionObject.product.cost.amount,
      biteTitle: "Made a bits donation!" // TODO: Use bit title
    });
  };

  onTransactionCancelled = transactionObject => {
    if (transactionObject && transactionObject.message === "Not Implemented") {
      return;
    }
  };

  render() {
    return (
      <PageContainer
        showScreen={!this.state.finishedLoading || !this.state.isVisible}
      >
        <TransactionSubscription
          onTransactionCancelled={this.onTransactionCancelled}
          onTransactionComplete={this.onTransactionComplete}
        />
        {this.state.showUserDonate && (
          <UserTransaction
            username={this.state.user.name}
            bitsDonated={this.state.user.bitsDonated}
            blerpTitle={this.state.user.biteTitle}
            transparent={true}
            logoHighlight={true}
            giant={this.props.giant}
          />
        )}
      </PageContainer>
    );
  }
}
