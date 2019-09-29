/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import * as React from "react";
import styled, { keyframes } from "styled-components";
import CloseButton from "./buttons/CloseButton";
import Header from './Header';
import StreamerSquareRow from "./StreamerSquareRow";
import StreamerSquareRec from "./StreamerSquareRec";


import {
  actionBackground,
  primaryText,
  flyoutBackground,
  pandaPink,
  defaultBackground,
  headerText,
  iconsActive,
  inputBorderColor,
  secondaryGray,
  secondaryText,
  bodyText
} from "../other/colors";

const screenSizeHide = 1024;

const slideIn = keyframes`
  0% {
    opacity: 0;
  }

  25% {

  }

  50% {
  }

  75% {
  }

  100% {
    opacity: 1;
  }
`;

const slideOut = keyframes`
  0% {
    opacity: 1;
    top: 0;
  }

  25% {

  }

  50% {
  }

  75% {
  }

  100% {
    opacity: 0;
    top: ${screenSizeHide}px;
  }
`;

const ScreenContainer = styled.div`
  position: fixed;
  background-color: rgba(255, 255, 255, 1);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000001;
  border-radius: 0;
  max-height: 720px;
  visibility: ${(props) => {
		return props.showScreen ? "visible" : "hidden";
	}};
	opacity: ${(props) => {
		return props.showScreen ? 1 : 0;
	}};
  top: ${props => {
    return props.showScreen ? "0" : `${screenSizeHide}px`;
  }};
  animation: ${props => {
      return props.showScreen ? slideIn : slideOut;
    }}
    0.5s 1;
  border-radius: ${props => (props.isOverlay ? "12px" : "0")};

  @media (min-width: 600px) {
    justify-content: center;
  }
`;

const HeaderText = styled.div`
  font-weight: 600;
  text-align: center;
  font-size: 18px;
  line-height: 18px;
  padding: 8px;
  text-decoration: none;
  color: ${bodyText};
`;

const SecondaryText = styled.div`
  text-align: center;
  font-size: 14px;
  line-height: 14px;
  text-decoration: none;
  margin: 8px;
  color: ${props => (props.color ? props.color : secondaryText)};
`;

const streamers = [
  {
    "display_name":"FabledFoxy",
    "_id":"206817556",
    "name":"fabledfoxy",
    "type":"user",
    "bio":null,
    "created_at":"2018-03-19T17:43:35.550357Z",
    "updated_at":"2019-09-29T12:57:13.528427Z",
    "logo":"https://static-cdn.jtvnw.net/jtv_user_pictures/8e9415fa-df6e-474b-9997-292bb4dfd49f-profile_image-300x300.png"
 },
 {
    "display_name":"Cispy",
    "_id":"263618815",
    "name":"cispy",
    "type":"user",
    "bio":null,
    "created_at":"2018-09-29T22:34:47.325276Z",
    "updated_at":"2019-09-28T19:12:08.957571Z",
    "logo":"https://static-cdn.jtvnw.net/user-default-pictures/4cbf10f1-bb9f-4f57-90e1-15bf06cfe6f5-profile_image-300x300.jpg"
 },
  { 
     "display_name":"yourcutefriend",
     "_id":"403127532",
     "name":"yourcutefriend",
     "type":"user",
     "bio":null,
     "created_at":"2018-12-20T03:42:56.6163Z",
     "updated_at":"2019-06-29T20:27:59.475008Z",
     "logo":"https://static-cdn.jtvnw.net/user-default-pictures/0ecbb6c3-fecb-4016-8115-aa467b7c36ed-profile_image-300x300.jpg"
  }
]

const recStreamers = [ 
  { 
     "display_name":"aaronkc",
     "_id":"55810970",
     "name":"aaronkc",
     "type":"user",
     "bio":"Engineer, Content Creator, and Inventor",
     "created_at":"2014-01-30T06:19:43.642549Z",
     "updated_at":"2019-09-26T15:51:33.173774Z",
     "logo":"https://static-cdn.jtvnw.net/jtv_user_pictures/ef522b6e-48cf-4632-a31a-0726348ee280-profile_image-300x300.jpeg"
  },
    {
       "display_name":"CheezyNerd",
       "_id":"116644218",
       "name":"cheezynerd",
       "type":"user",
       "bio":"I play games and stuff. its my DESTINY to play XB1. I have a HALO over my head if your on my team. If were on the opposite teams there might be a FALLOUT.There's no DIVISION of gamers and people here. So have fun get along and lets makes this a good FABLE. ",
       "created_at":"2016-02-22T10:42:45.172064Z",
       "updated_at":"2019-09-26T02:02:06.905258Z",
       "logo":"https://static-cdn.jtvnw.net/jtv_user_pictures/cheezynerd-profile_image-1590c58d70e8f171-300x300.jpeg"
    }
]

const BarContainerVerticle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`; 

const BlueBarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`; 

const BarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  margin: 12px;
  min-height: 80px;
`; 

const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`; 

const BlueBar = styled.div`
  background-color: ${props => (props.full ? '#FF8484' : '#C4C4C4')};
  height: ${props => (props.full ? '100%' : '50%')};
  width: 32px;
`; 

const GrayBar = styled.div`
  background-color: #65AFFF;
  height: 80px;
`; 

const HugButton = styled.button`
  border: none;
  background-color: #006BE8;
  width: 200px;
  height: 60px;
  font-size: 18px;
  color: #fff;
`;

const MAX = 2;
const MIN = 0;

const CURRENT_COUNT = 1;

const currentStreamer =  { 
  "display_name":"blerp",
  "_id":"253326823",
  "name":"blerp",
  "type":"user",
  "bio":"The soundboard to end all soundboards! - https://blerp.com",
  "created_at":"2018-08-30T06:22:08.015625Z",
  "updated_at":"2019-09-28T15:31:55.443125Z",
  "logo":"https://static-cdn.jtvnw.net/jtv_user_pictures/6fb5ef7a-b193-4ec1-9fc4-cc9750a3b128-profile_image-300x300.png"
}


class FirstScreenInteraction extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        selectedStreamer: null,
        hugged: false,
        full: false
    }
  }
  handleCloseClick = () => {
    if (this.props.onCloseClick) {
      this.props.onCloseClick();
    }
  };

  handleStreamerSelect = (streamer) => () => {
    this.setState({selectedStreamer: streamer})
  }

  onHug = () => {
    this.setState({hugged: true})
  }

  render() {

    if(this.state.selectedStreamer){
      return (
        <ScreenContainer
          showScreen={true}
          isOverlay={this.props.isOverlay}
        >
          <Header />
          <BarContainerVerticle>
            <BlueBarContainer>
              <BarContainer>  
              <SecondaryText>{"Our hugs"}</SecondaryText>
                  <HeaderText>{currentStreamer.display_name}</HeaderText>
                  <GrayBar>
                    <BlueBar full={true}/>
                  </GrayBar>
              </BarContainer>

                <BarContainer>
                  <SecondaryText>{MAX}</SecondaryText>

                  <SecondaryText>{MIN}</SecondaryText>
                </BarContainer>

                <BarContainer>
                <SecondaryText>{"Their hugs"}</SecondaryText>
                    <HeaderText>{this.state.selectedStreamer.display_name}</HeaderText>

                    <GrayBar>
                      <BlueBar full={this.state.hugged} />
                    </GrayBar>
                </BarContainer>

            </BlueBarContainer>
          </BarContainerVerticle>

          {this.state.hugged ? <HugButton>Hugged</HugButton> : <HugButton onClick={this.onHug}>Hug</HugButton>}
  
        </ScreenContainer>
      );
    }

    return (
      <ScreenContainer
        showScreen={true}
        isOverlay={this.props.isOverlay}
      >
        <Header />

        <StreamerSquareRow streamers={streamers}/>

        <StreamerSquareRec streamers={recStreamers} onStreamerClick={this.handleStreamerSelect} />

      </ScreenContainer>
    );
  }
}

export default FirstScreenInteraction;
