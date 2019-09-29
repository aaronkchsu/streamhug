import * as React from 'react';
import styled from 'styled-components';
import BlerpBlastEditWrapper from './BlerpBlastEditWrapper';
import BlerpBlastPreviewWrapper from './BlerpBlastPreviewWrapper';

import {
  pandaPink,
  pandaTeal,
  flyoutBackground,
  statusColor,
  placeholderText,
  primaryText,
  bodyText,
  secondaryText,
  defaultBackground,
  secondaryGray,
  lightGray,
  darkBlue
} from '../../other/colors';

const Container = styled.div`
  position: relative;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  background-color: transparent;
  width: 100%;
`;

const ButtonContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
`;

const RowContainerTransparent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  background-color: ${defaultBackground};
  border-radius: 6px;
  padding: 8px 0;
  opacity: 0.85;
`;

const RowContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  background-color: transparent;
  border-radius: 6px;
  margin: 8px;
`;

const Button = styled.button`
  margin: 4px;
  font-weight: lighter;
  padding: 4px 12px;
  text-decoration: none;
  color: ${(props) => (props.isDisabled ? bodyText : bodyText)};
  white-space: nowrap;
  background-color: transparent;
  border: 2px solid ${(props) => (props.isDisabled ? bodyText : bodyText)};
  border-radius: 40px;
  font-size: 14px;
  line-height: 14px;
  height: 32px;

  &:focus {
    border-radius: 40px;
    border: 2px solid ${bodyText} !important;
    outline: 0 !important;
    box-shadow: none !important;
  }

  &:hover {
    transition: all 0.2s ease 0s;
    color: ${bodyText};
  }

  &:active {
    color: ${(props) => (props.isDisabled ? bodyText : bodyText)};
    border: 2px solid ${(props) => (props.isDisabled ? bodyText : bodyText)};
    background-color: ${(props) => (props.isDisabled ? defaultBackground : bodyText)};
    transition: all 0.2s ease 0s;
  }
`;

const SubscribedText = styled.p`
  color: ${bodyText};
  font-weight: 600;
  font-size: 8px;
  position: absolute;
  bottom: 16px;
  right: 16px;
`;

const ContainerTitle = styled.p`
  color: ${bodyText};
  font-weight: 600;
  font-size: 12px;
  align-self: flex-start;
  text-decoration: none;
  margin: 4px 0;
`;

const HideButtonClose = styled.button`
  position: relative;
  width: 60px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  align-self: center;
  border-radius: 0 0 16px 16px;
  background-color: ${(props) => (props.selectedBlastBitesFull ? pandaPink : lightGray)};
  border: none;
  opacity: 0.95;

  &:focus {
    border-radius: 0 0 16px 16px;
    border: 2px solid ${pandaPink}!important;
    outline: 0 !important;
    box-shadow: none !important;
  }
`;

const HideButtonCloseIcon = styled.img`
  width: 100%;
  height: 100%;
  align-self: center;
  white-space: nowrap;
`;

const MainCornerButtonClose = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  opacity: 1;
  z-index: 1000;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  background-color: transparent;
  border: none;
`;

const MainCornerButtonCloseIcon = styled.img`
  width: 100%;
  height: 100%;
  min-width: 16px;
  min-height: 16px;
  align-self: center;
  white-space: nowrap;
`;

const InnerContainer = styled.div`
  position: relative;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  background-color: ${lightGray};
  padding: 8px;
  opacity: 0.95;
`;

const TextContainer = styled.div`
  position: relative;
  display: flex;
  overflow: hidden;
  flex-direction: row;
  padding: 8px;
`;

const StyleLink = styled.button`
  font-weight: 600;
  text-align: center;
  font-size: 12px;
  line-height: 14px;
  text-decoration: underline;
  color: ${darkBlue};
  white-space: nowrap;
  margin: 4px 0;
  border: none;
  background-color: transparent;

  &:focus {
    border: 1px solid ${darkBlue} !important;
    outline: 0 !important;
    box-shadow: none !important;
    border-radius: 4px;
  }

  &:hover {
    opacity: 0.8;
  }
`;

{
  /* 
    <HideButtonClose onClick={this.props.onClickBlastEdit({ show: false })}>
        <HideButtonCloseIcon src="https://storage.googleapis.com/blerp-public-images/twitch/dark-close-icon.svg" />
    </HideButtonClose> 
  */
}

class BlerpBlastContainer extends React.Component {
  state = {
    isMinimized: false
  };

  onMinimizedClicked = () => {
    this.setState({ isMinimized: !this.state.isMinimized });
  };

  render() {
    return (
      <Container>
        {!this.props.isBlastEditing ? (
          <RowContainerTransparent>
            {/* {!this.props.subscriptionStatus && <ButtonTitle>{'Subscribe To Blast Blerps'}</ButtonTitle>} */}
            <ButtonContainer>
              {!this.props.subscriptionStatus ? (
                <React.Fragment>
                  <StyleLink onClick={this.props.openBlastTutorial}>{'Subscribe to blast multiple sounds!'}</StyleLink>
                  <Button onClick={this.props.onSubscribeClick} isDisabled={!this.props.subscriptionStatus}>
                    {'Subscribe'}
                  </Button>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <BlerpBlastPreviewWrapper subscriptionStatus={this.props.subscriptionStatus} />
                  <Button onClick={this.props.onClickBlastEdit({ show: true })} isDisabled={false}>
                    {`+ Send Multiple Sounds`}
                  </Button>
                </React.Fragment>
              )}
            </ButtonContainer>
          </RowContainerTransparent>
        ) : (
          <React.Fragment>
            {this.state.isMinimized ? (
              <HideButtonClose
                onClick={this.onMinimizedClicked}
                selectedBlastBitesFull={this.props.selectedBlastBitesFull}
              >
                <HideButtonCloseIcon
                  src={'https://storage.googleapis.com/blerp_products/Twitch/Assets/Arrows/Chevron_White_Down.svg'}
                />
              </HideButtonClose>
            ) : (
              <React.Fragment>
                <MainCornerButtonClose onClick={this.props.onClickBlastEdit({ show: false })}>
                  <MainCornerButtonCloseIcon src="https://storage.googleapis.com/blerp_products/Twitch/Assets/Close_Black.svg" />
                </MainCornerButtonClose>
                <InnerContainer>
                  <TextContainer>
                    <ContainerTitle>{`Select Blerps to play a`}</ContainerTitle>
                    <StyleLink onClick={this.props.openBlastTutorial}>{'Blerp Blast'}</StyleLink>
                    <ContainerTitle>{`for ${this.props.blastPrice} Bits`}</ContainerTitle>
                  </TextContainer>
                  <RowContainer>
                    <ButtonContainer>
                      <BlerpBlastEditWrapper subscriptionStatus={this.props.subscriptionStatus} />
                    </ButtonContainer>
                  </RowContainer>
                </InnerContainer>
                <HideButtonClose onClick={this.onMinimizedClicked}>
                  <HideButtonCloseIcon
                    src={'https://storage.googleapis.com/blerp_products/Twitch/Assets/Arrows/Chevron_White_Up.svg'}
                  />
                </HideButtonClose>
              </React.Fragment>
            )}
            {/* <SubscribedText>{'Subscribed'}</SubscribedText> */}
          </React.Fragment>
        )}
      </Container>
    );
  }
}

export default BlerpBlastContainer;
