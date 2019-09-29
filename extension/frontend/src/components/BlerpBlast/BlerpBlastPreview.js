import * as React from 'react';
import styled from 'styled-components';

const OverallContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: row;
  margin: 4px;
`;

const SelectedBitesRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
`;

const BiteImage = styled.img`
  width: 100%;
  height: 100%;
  align-self: center;
  white-space: nowrap;
  border-radius: 32px;
`;

class BlerpBlastPreview extends React.Component {
  static defaultProps = {
    selectedBlastBites: [ null, null, null, null, null ]
  };

  hideErrorImage(i) {
    i.target.src = 'https://storage.googleapis.com/blerp-public-images/social/large-profile-black.svg';
  }

  renderSelectedBite = (bite, index) => {
    if (bite) {
      return (
        <ImageContainer key={index}>
          <BiteImage
            onError={this.hideErrorImage}
            src={bite.imageUrl || 'https://storage.googleapis.com/blerp-public-images/social/large-profile-black.svg'}
          />
        </ImageContainer>
      );
    } else {
      return (
        <ImageContainer key={index}>
          <BiteImage src="https://storage.googleapis.com/blerp-content-images-1144/original/default2-a89e-4a33-8a26-4fff77cd9607" />
        </ImageContainer>
      );
    }
  };

  render() {
    const slicedBites = this.props.selectedBlastBites.slice(0, this.props.maxSelectionNumber);
    return (
      <OverallContainer>
        <SelectedBitesRow>
          {slicedBites.map((bite, index) => {
            return this.renderSelectedBite(bite, index);
          })}
        </SelectedBitesRow>
      </OverallContainer>
    );
  }
}

export default BlerpBlastPreview;
