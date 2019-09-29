/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import gql from "graphql-tag";

import React from "react";
import { ChildProps, compose, graphql } from "react-apollo";

import styled, { keyframes } from "styled-components";

import VolumeIcon from "../icons/volume-icon";
import { Rail, Slider, Handles, Tracks, Ticks } from "react-compound-slider";
import { Handle, Track, Tick } from "./SliderComponents";

import { lightGray, pandaPink } from "../other/colors";

const sliderStyle = {
  // Give the slider some width
  position: "relative",
  width: "100%",
  height: 80
};

const railStyle = {
  position: "absolute",
  width: "100%",
  height: 4,
  marginTop: 38,
  borderRadius: 5,
  backgroundColor: lightGray
};

import { randomBlerpColor } from "../other/colors";

const VolumeContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 200px;
`;

const VolumeIconButton = styled.button`
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  width: 40px;
  height: 40px;
  border: none;
  background-position: center;
  transition: ease-in-out;
  transition: background 1.2s;
  margin: 4px;

  &:focus {
    border-radius: 8px;
    border: 2px solid ${pandaPink} !important;
    outline: 0 !important;
    box-shadow: none !important;
  }

  &:active {
    opacity: 0.7;
  }

  &:hover {
    opacity: 0.8;
    transition: all 0.2s ease 0s;
  }
`;

// interface Props {
//   onVolumeSelect?: (props: { volume: any }) => {};
//   defaultVolume?: number;
//   maxVolume?: number;
//   minVolume?: number;
//   step?: number;
//   className?: any;
//   setGlobalVolume?: any;
// }
//
// interface State {
//   volume: number;
//   color: string;
//   isMuted: boolean;
//   lastVolume: number;
// }

const DefaultProps = {
  maxVolume: 1.0,
  minVolume: 0,
  onVolumeSelect: () => {},
  step: 0.01,
  defaultVolume: 1.0
};

class VolumeSlider extends React.Component {
  static defaultProps = DefaultProps;
  menuElement;
  props;
  state;

  constructor(props){
    super(props)
    this.state = {
      color: randomBlerpColor(),
      isMuted: false,
      lastVolume: props.defaultVolume || 1,
      volume: props.defaultVolume || 1
    };
  }


  componentWillReceiveProps(newProps) {
    if(newProps.defaultVolume !== this.state.volume) {
      this.setState({ volume: newProps.defaultVolume })
    }
  }

  onSelectClick = event => {};

  toggleMute = () => {
    this.setState(
      {
        isMuted: !this.state.isMuted,
        lastVolume: this.state.volume,
        volume: this.state.isMuted ? this.state.lastVolume : 0
      },
      () => {
        this.props.authNetwork.postChannelVolume({ volume: !this.state.isMuted ? this.state.volume : 0 });
      }
    );
  };

  changingVolume = volumeArray => {
    this.setState({
      isMuted: false,
      volume: volumeArray[0]
    });
  };

  changeVolume = volumeArray => {
    this.setState({
      isMuted: false,
      volume: volumeArray[0]
    });
    this.props.authNetwork.postChannelVolume({ volume: volumeArray[0] });
  };

  render() {
    return (
      <VolumeContainer
        key={this.props.defaultVolume}
        className={this.props.className}
      >
        <VolumeIconButton onClick={this.toggleMute}>
          <VolumeIcon muted={this.state.isMuted} />
        </VolumeIconButton>
        <Slider
          rootStyle={sliderStyle}
          domain={[this.props.minVolume, this.props.maxVolume]} // [min, max]
          values={[this.state.volume]} // slider values
          step={this.props.step}
          onChange={this.changingVolume}
          onSlideEnd={this.changeVolume}
        >
          <Rail>
            {(
              { getRailProps } // adding the rail props sets up events on the rail
            ) => <div style={railStyle} {...getRailProps()} />}
          </Rail>
          <Handles>
            {({ handles, getHandleProps }) => (
              <div className="slider-handles">
                {handles.map(handle => (
                  <Handle
                    key={handle.id}
                    handle={handle}
                    getHandleProps={getHandleProps}
                    isVolume={true}
                  />
                ))}
              </div>
            )}
          </Handles>
          <Tracks right={false}>
            {({ tracks, getTrackProps }) => (
              <div className="slider-tracks">
                {tracks.map(({ id, source, target }) => (
                  <Track
                    key={id}
                    source={source}
                    target={target}
                    getTrackProps={getTrackProps}
                    isVolume={true}
                  />
                ))}
              </div>
            )}
          </Tracks>
          <Ticks count={1}>
            {({ ticks }) => (
              <div className="slider-ticks">
                {ticks.map(tick => (
                  <Tick
                    key={tick.id}
                    tick={tick}
                    count={ticks.length}
                    labelText={"db"}
                  />
                ))}
              </div>
            )}
          </Ticks>
        </Slider>
      </VolumeContainer>
    );
  }
}

const setGlobalVolume = gql`
  mutation setGlobalVolumeFromTwitchVolume($volume: Int!, $muted: Boolean!) {
    setGlobalVolumeIsMuted(muted: $muted) @client
  }
`;

export default compose(
  graphql(setGlobalVolume, {
    name: "setGlobalVolume"
  })
)(VolumeSlider);
