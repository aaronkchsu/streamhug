import React from "react";

import {
  subscribeTransactionComplete,
  subscribeTransactionCancelled
} from "../networking";

class TransactionSubscription extends React.Component {
  async componentDidMount() {
    subscribeTransactionComplete(transactionObject => {
      this.props.onTransactionComplete(transactionObject);
    });
    subscribeTransactionCancelled(transactionObject => {
      this.props.onTransactionCancelled(transactionObject);
    });
  }

  componentWillUnmount() {
    this.onTransactionComplete == null;
    this.onTransactionCancelled == null;
  }

  render() {
    return <div />;
  }
}

export default TransactionSubscription;
