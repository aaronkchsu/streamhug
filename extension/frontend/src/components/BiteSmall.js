/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import Observer from "@researchgate/react-intersection-observer";

import * as React from "react";
import styled, { keyframes } from "styled-components";

import AudioButton, { ButtonModes } from "./AudioButtonWrapper";

import ShareButton from "./ShareButtonWrapper";
import { BitCount } from "../other/twitchApi";
// import FavoriteStarButton from "../shared/FavoriteStarButton";

import {
  flyoutBackground,
  bodyText,
  pandaPink,
  iconsInActive
} from "../other/colors";

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }

  25% {
    opacity: 0.2;
  }

  50% {
    opacity: 0.6;
  }

  75% {
    opacity: 0.9;
  }

  100% {
    opacity: 1;
  }`;

const bounceOut = keyframes`
  0% {
    opacity: 0;
    width: 30px;
    height: 30px;
  }

  25% {
    width: 64px;
    height: 64px;
  }

  50% {
  }

  75% {
  }

  100% {
    opacity: 1;
    width: 52px;
    height: 52px;
  }
`;

const ContentContainer = styled.div`
  width: 180px;
  height: 280px;
  position: relative;
  border-radius: 100px;
  animation: ${fadeIn} 0.4s 1;
  cursor: pointer;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  @media (min-width: 0) {
    width: 89px;
    height: 158px;
  }
`;

const BlerpContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 180px;
  height: 180px;
  border-radius: 100px;
  cursor: pointer;

  @media (min-width: 0) {
    width: 89px;
    height: 89px;
  }
`;

const animateIn = keyframes`
  0% {
    opacity: 0;
  }

  25% {
    opacity: 0.2;
  }

  50% {
    opacity: 0.6;
  }

  75% {
    opacity: 0.9;
  }

  100% {
    opacity: 1;
  }
`;

const BackgroundImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 180px;
  height: 180px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  z-index: 1;
  border-radius: 100px;
  animation: ${animateIn} 0.9s 1;

  $:invalid {
    background-color: pink;
  }

  @media (min-width: 0) {
    width: 89px;
    height: 89px;
  }
`;

const StyledAudioButton = styled(AudioButton)`
  overflow: hidden;
  background-color: transparent;
  width: 180px;
  height: 180px;
  border-radius: 100px;
  border: none;
  position: absolute;
  z-index: 11;

  @media (min-width: 0) {
    width: 89px;
    height: 89px;
  }

  &:focus {
    opacity: 1;
    border: none !important;
  }

  &:focus ~ .blerp-bite-title {
    opacity: 0.2;
    transition: all 0.2s ease 0s;
  }

  .blerp-bite.scrim &:focus {
    box-shadow: inset 0 0 70px 1em rgba(0, 0, 0, 1);
    transition: all 0.3s ease 0s;
  }
`;

const StyledShareButton = styled(ShareButton)`
  position: absolute;
  transform: translate(137px, 137px);
  overflow: hidden;
  border: 3px solid ${flyoutBackground};
  background-color: ${props =>
    props.isFeaturedBite ? pandaPink : iconsInActive};
  border-radius: 100px;
  cursor: pointer;
  width: 52px;
  height: 52px;
  background-position: center;
  transition: ease-in-out;
  transition: background 1.2s;
  background-position: center;
  z-index: 11;
  animation: ${bounceOut} 0.1s 1;

  &:focus {
    background-color: ${props =>
      props.isFeaturedBite ? iconsInActive : pandaPink};
    outline: 0 !important;
    box-shadow: none !important;
  }

  &:active {
    background-color: ${props =>
      props.isFeaturedBite ? iconsInActive : pandaPink};
    opacity: 1;
  }

  &:hover {
    opacity: 0.6;
  }

  @media (min-width: 0) {
    transform: translate(60px, 60px);
    opacity: 1;
    width: 36px;
    height: 36px;
    padding: 0;
  }

  & img {
    outline: 0;
    height: 100%;
    width: 100%;

    @media (min-width: 0) {
      height: 16px;
      width: 16px;
    }
  }
`;

const Scrim = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background-color: ${props =>
    props.darker ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.1)"};
  box-shadow: inset 0 0 70px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  width: 180px;
  height: 180px;
  z-index: 2;
  border-radius: 100px;
  transition: all 0.2s ease 0s;
  animation: ${animateIn} 0.9s 1;

  @media (min-width: 0) {
    width: 89px;
    height: 89px;
  }

  &:hover .blerp-audio-button {
    opacity: 1;
    transition: all 0.2s ease 0s;
  }

  &:hover .blerp-bite-menu-more {
    opacity: 1;
    transition: all 0.2s ease 0s;
    animation: ${bounceOut} 0.2s 1;
  }

  &:hover .blerp-bite-open {
    opacity: 0.6;
    transition: all 0.2s ease 0s;
  }

  &:focus .blerp-bite-open {
    opacity: 0.6;
    transition: all 0.2s ease 0s;
  }

  &:hover .blerp-bite-title {
    opacity: 0.2;
    transition: all 0.2s ease 0s;
  }

  &:focus .blerp-audio-button {
    opacity: 1;
    transition: all 0.2s ease 0s;
  }

  &:focus .blerp-bite-title {
    opacity: 0.2;
    transition: all 0.2s ease 0s;
  }

  &:hover {
    box-shadow: inset 0 0 70px 1em rgba(0, 0, 0, 1);
    transition: all 0.3s ease 0s;
  }
`;

const BiteTitleContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: row;
  z-index: 10;
  position: absolute;
  bottom: 0;
  width: 168px;
  height: 60px;

  @media (min-width: 0) {
    font-size: 12px;
    width: 89px;
    height: 60px;
  }
`;

const StyledFavoriteButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 40px;
  height: 40px;
  border: none;
  background-color: transparent;
  background-position: center;
  z-index: 11;
  text-decoration: none;
  opacity: 0.6;

  &:focus {
    opacity: 0.6;
    border: none;
  }
`;

const TitleSection = styled.div`
  width: 136px;
  margin-right: 8px;
  font-size: 16px;
  font-weight: normal;
  text-align: left;
  color: ${props => (props.night ? flyoutBackground : bodyText)};
  overflow: hidden;
  text-overflow: ellipsis;
  display: box;
  line-height: 20px;
  max-height: 60px;
  -webkit-line-clamp: 4;

  &:hover {
    opacity: 0.6;
  }

  @media (min-width: 0) {
    font-size: 12px;
    width: 70px;
    height: 60px;
  }

  &:active {
    color: rgba(150, 150, 150, 1);
    transition: all 0.2s ease 0s;
  }
`;

const CenteredTitleSection = styled.div`
  font-size: 16px;
  font-weight: normal;
  text-align: center;
  color: ${props => (props.night ? flyoutBackground : bodyText)};
  overflow: hidden;
  text-overflow: ellipsis;
  display: box;
  line-height: 20px;
  max-height: 60px;
  cursor: normal;
  -webkit-line-clamp: 4;

  @media (min-width: 0) {
    font-size: 12px;
    height: 60px;
  }
`;
const CenteredTitleLink = styled.a`
  font-size: 16px;
  font-weight: normal;
  text-align: center;
  color: ${props => (props.night ? flyoutBackground : bodyText)};
  overflow: hidden;
  text-overflow: ellipsis;
  display: box;
  line-height: 20px;
  max-height: 60px;
  cursor: normal;
  -webkit-line-clamp: 4;
  text-decoration: none;

  @media (min-width: 0) {
    font-size: 12px;
    height: 60px;
  }
`;

const PlaceholderImage = styled.div`
  width: 180px;
  height: 180px;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 100px;
  background-color: ${props =>
    props.backgroundColor ? props.backgroundColor : "transparent"};

  @media (min-width: 0) {
    width: 89px;
    height: 89px;
  }
`;

// interface Props {
//   color?: string;
//   id: string;
//   title: string;
//   image?: string;
//   playCount?: any;
//   audioSourceUrls: string[];
//   spamBlerp?: boolean;
//   favorited?: boolean;
//   favoriteCallback?: any;
//   featuredPage?: string;
//   night?: boolean;
//   isFeaturedBite?: boolean;
//   prefetchLink?: boolean;
//   preload?: boolean;
// }
//
// interface State {
//   color: string;
//   observed: boolean;
//   favorited: boolean;
//   playCount: any;
// }

class Bite extends React.Component {
  static defaultProps = {
    image:
      "https://storage.googleapis.com/blerp-main-bucket/images/default2-a89e-4a33-8a26-4fff77cd9607.png",
    featuredPage: "",
    night: false,
    isFeaturedBite: false,
    prefetchLink: true,
    preload: false
  };

  constructor(props) {
    super(props);
    this.state = {
      color: pandaPink,
      observed: false,
      favorited: props.favorited,
      playCount: props.playCount
    };
  }

  playCallback = () => {
    this.setState({
      playCount: this.state.playCount + 1
    });
  };

  favoriteCallback = favorited => {
    this.setState({ favorited });
    if (this.props.favoriteCallback) {
      this.props.favoriteCallback(this.props.id, favorited);
    }
  };

  hideErrorImage(i) {
    i.target.style.display = "none";
  }

  render() {
    return (
      <Observer onChange={this.handleIntersection}>
        <ContentContainer
          style={{
            backgroundColor: "transparent"
          }}
          role="listitem"
          title={this.props.title}
        >
          <BlerpContainer
            style={{
              backgroundColor: this.state.color
            }}
          />
          {this.props.image &&
            this.state.observed && (
              <BackgroundImage
                ariaHidden="true"
                src={this.props.image}
                alt=""
                onError={this.hideErrorImage}
              />
            )}
          {this.state.observed ? (
            <Scrim
              className="blerp-bite-scrim"
              darker={Boolean(this.props.image)}
            >
              <StyledAudioButton
                title={this.props.title}
                biteId={this.props.id}
                sources={this.props.audioSourceUrls}
                preload={this.props.preload}
                showButton={false}
                handleIncrementPlayCount={this.playCallback}
                mode={
                  this.props.spamBlerp ? ButtonModes.spam : ButtonModes.play
                }
                useGlobalAudio={true}
                featuredPage={this.props.featuredPage}
              />
              {this.props.loggedIn && (
                <StyledShareButton
                  className="blerp-bite-menu-more"
                  biteId={this.props.id}
                  biteTitle={this.props.title}
                  audioUrl={this.props.audioSourceUrls[0]}
                  imageUrl={this.props.image}
                  bitCount={BitCount}
                  isFeaturedBite={this.props.isFeaturedBite}
                />
              )}
            </Scrim>
          ) : (
            <PlaceholderImage backgroundColor={this.state.color} />
          )}
          <BiteTitleContainer>
            {this.props.canLink ? (
              <CenteredTitleLink
                href={`https://blerp.com/soundbites/${this.props.id}`}
                target="_blank"
              >
                {this.props.title}
              </CenteredTitleLink>
            ) : (
              <CenteredTitleSection>{this.props.title}</CenteredTitleSection>
            )}
            {/* <TitleSection className="blerp-bite-title" night={this.props.night}>
              {this.props.title}
            </TitleSection>
            <StyledFavoriteButton
              biteId={this.props.id}
              loggedIn={true}
              favorited={this.state.favorited}
              favoriteCallback={this.favoriteCallback}
            /> */}
          </BiteTitleContainer>
        </ContentContainer>
      </Observer>
    );
  }

  handleIntersection = event => {
    this.setState({ observed: event.isIntersecting });
  };
}

export default Bite;
