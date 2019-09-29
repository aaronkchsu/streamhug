import * as React from 'react';
import styled from 'styled-components';
import {
  darkBlue,
  defaultBackground
} from '../other/colors';

const Container = styled.div`
  position: relative;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  width: 100%;
  background-color: ${defaultBackground};
  opacity: 0.85;
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
  background-color: transparent;
  border-radius: 6px;
  opacity: 0.85;
`;

const StyleLink = styled.button`
  font-weight: 600;
  text-align: center;
  font-size: 12px;
  line-height: 12px;
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

class HeaderNotLoggedIn extends React.Component {
  state = {
    isMinimized: false
  };

  onMinimizedClicked = () => {
    this.setState({ isMinimized: !this.state.isMinimized });
  };

  render() {
    return (
      <Container>
        <RowContainerTransparent>
          <ButtonContainer>
            <React.Fragment>
              <StyleLink onClick={this.props.handleOpenShareIdentity}>{'Share identity to play sounds live on stream'}</StyleLink>
              {/* <Button onClick={this.props.onSubscribeClick} isDisabled={!this.props.isSubscriber}>
                {'Share user info'}
              </Button> */}
            </React.Fragment>
          </ButtonContainer>
        </RowContainerTransparent>
      </Container>
    );
  }
}

export default HeaderNotLoggedIn;
