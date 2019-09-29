import * as React from 'react';
import styled from 'styled-components';
import PinkShareButton from '../buttons/PinkShareButton';
import MinusCornerButton from '../buttons/MinusCornerButton';
import HorizontalList from '../lists/HorizontalList';

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
  lightGray
} from '../../other/colors';

const OverallContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: row;
  width: 100%;
`;

const BiteContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  min-width: 48px;
  min-height: 48px;
`;

const BiteImage = styled.img`
  width: 100%;
  height: 100%;
  min-width: 48px;
  min-height: 48px;
  align-self: center;
  white-space: nowrap;
  border-radius: 32px;
`;
//  border: 2px ${flyoutBackground} solid;

const StyledMinusCornerButton = styled(MinusCornerButton)`
    position: absolute;
    bottom: 0;
    right: 0;
    border: 2px ${lightGray} solid;
`;

const SubscribedText = styled.p`
  color: ${bodyText};
  font-weight: light;
  font-size: 8px;
  text-align: center;
  text-decoration: none;
  width: 48px;
  height: 20px;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const ClearText = styled.p`
  color: ${bodyText};
  font-weight: light;
  font-size: 12px;
  text-align: center;
  text-decoration: none;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const ClearButton = styled.button`
  opacity: 1;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  background-color: transparent;
  border: none;

  &:focus {
    border-radius: 8px;
    border: 2px solid ${pandaPink}!important;
    outline: 0 !important;
    box-shadow: none !important;
  }
`;

class BlerpBlastEdit extends React.Component {
  static defaultProps = {
    selectedBlastBites: [ null, null, null, null, null ]
  };

  hideErrorImage(i) {
    i.target.src = 'https://storage.googleapis.com/blerp-public-images/social/large-profile-black.svg';
  }

  renderList = (slicedBites, checkSelected, removeBiteByIndex) => (index, key) => {
    if (index === 0) {
      return (
        <ClearButton key={key} onClick={this.props.clearSelectedBites({ clear: true })}>
          <ClearText>{'Clear'}</ClearText>
        </ClearButton>
      );
    } else if (index === slicedBites.length + 1) {
      return checkSelected ? <PinkShareButton key={key} onClick={this.props.onSendClick} /> : <div key={key} />;
    } else {
      const realArrayIndex = index - 1;
      const bite = slicedBites[realArrayIndex];
      if (bite) {
        return (
          <BiteContainer key={key}>
            <ImageContainer>
              <BiteImage
                onError={this.hideErrorImage}
                src={
                  bite.imageUrl || 'https://storage.googleapis.com/blerp-public-images/social/large-profile-black.svg'
                }
              />
              <StyledMinusCornerButton onClick={removeBiteByIndex({ index: realArrayIndex })} />
            </ImageContainer>
            <SubscribedText>{bite.title}</SubscribedText>
          </BiteContainer>
        );
      } else {
        return (
          <ImageContainer key={key}>
            <BiteImage src="https://storage.googleapis.com/blerp-content-images-1144/original/default2-a89e-4a33-8a26-4fff77cd9607" />
          </ImageContainer>
        );
      }
    }
  };

  render() {
    const checkSelected = this.props.selectedBlastBites.reduce(
      (accumulator, currentValue) => !!(accumulator || currentValue)
    );
    // Only render the amount of bites maxed out for the tier
    const slicedBites = this.props.selectedBlastBites.slice(0, this.props.maxSelectionNumber);
    return (
      <OverallContainer>
        <HorizontalList
          length={slicedBites.length + 2} // Clear and share button
          renderListItems={this.renderList(slicedBites, checkSelected, this.props.removeBiteByIndex)}
          showArrows={true}
          isGrayButton={true}
          buttonColor={lightGray}
        />
      </OverallContainer>
    );
  }
}

export default BlerpBlastEdit;
