import React from 'react';
import styled, { keyframes } from "styled-components";
import UserTransaction from "../components/UserTransaction";
import FirstInteraction from "./firstInteraction";

import { defaultBackground } from '../other/colors';

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
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  0% {
    opacity: 1;
  }

  25% {
  }

  50% {
  }

  75% {
  }

  100% {
    opacity: 0;
  }
`;

const OverallPageContainer = styled.div`
  width: 100%;
  height: 460px;
  position: relative;

  &:hover .blerp-overlay-info-container {
    opacity: ${props => props.isLegacy ? "1" : "0"};
    animation: ${props => props.isLegacy ? fadeOut : null} 0.4s 1;
  }

  &:hover .blerp-main-content {
    opacity: 1;
    animation: ${props => props.isLegacy ? fadeIn : null}  0.7s 1;
  }
`;


const PageContainer = styled.div`
  position: relative;
  width: 100%;
  max-height: 100%;
  background-color: ${defaultBackground};
  opacity: ${props => props.isLegacy ? "0" : "1"};
  border-radius: ${props => props.isLegacy ? "12px" : "0px"};
  overflow-y: scroll;
`;

const OverlayContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  margin-left: auto;
  margin-right: auto;
  width: 258px; /* Need a specific value to work */
  visibility: visible;
  opacity: ${props => props.isLegacy ? "0.8" : "0"};
`;

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

class Page extends React.Component {
  render() {
    const isLegacy = getParameterByName("legacyComponentDesign")
    return (
      <OverallPageContainer isLegacy={isLegacy}>
        <OverlayContainer isLegacy={isLegacy} className="blerp-overlay-info-container">
          <UserTransaction
            logoHighlight={true}
            transparent={true}
          />
        </OverlayContainer >
        <PageContainer isLegacy={isLegacy} className="blerp-main-content">
          <FirstInteraction isOverlay={isLegacy ? true : false} client={this.props.client} logAction={this.props.logAction} />
        </PageContainer>
      </OverallPageContainer>
    );
  }
}

export default Page;
