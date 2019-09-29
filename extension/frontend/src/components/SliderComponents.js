import React from "react";
import {
  flyoutBackground,
  bodyText,
  pandaPink,
  iconsInActive,
  pandaTeal,
  secondarySubtitleText,
  lightGray
} from "../other/colors";

// *******************************************************
// HANDLE COMPONENT
// *******************************************************
export function Handle({
  // your handle component
  handle: { id, value, percent },
  getHandleProps,
  isVolume
}) {
  return (
    <div
      style={{
        left: `${percent}%`,
        position: "absolute",
        marginLeft: -15,
        marginTop: isVolume ? 28 : 25,
        zIndex: 2,
        width: 20,
        height: 20,
        borderWidth: 2,
        borderStyle: "solid",
        textAlign: "center",
        cursor: "pointer",
        borderRadius: "50%",
        borderColor: flyoutBackground,
        backgroundColor: pandaTeal,
        color: pandaTeal
      }}
      {...getHandleProps(id)}
    >
      <div
        style={{
          fontFamily: "Odudo",
          fontSize: 14,
          marginTop: -20,
          color: secondarySubtitleText
        }}
      >
        {value}
      </div>
    </div>
  );
}

export function Track({ source, target, getTrackProps, isVolume }) {
  // your own track component
  return (
    <div
      style={{
        position: "absolute",
        height: 4,
        zIndex: 1,
        marginTop: isVolume ? 38 : 35,
        backgroundColor: pandaTeal,
        borderRadius: 5,
        cursor: "pointer",
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`
      }}
      {...getTrackProps()} // this will set up events if you want it to be clickeable (optional)
    />
  );
}

// *******************************************************
// TICK COMPONENT
// *******************************************************
export function Tick({ tick, count, labelText }) {
  // your own tick component
  return (
    <div>
      <div
        style={{
          position: "absolute",
          marginTop: 52,
          marginLeft: -0.5,
          width: 1,
          height: 8,
          backgroundColor: "transparent",
          left: `${tick.percent}%`
        }}
      />
      <div
        style={{
          position: "absolute",
          marginTop: 48,
          fontSize: 10,
          fontFamily: "Odudo",
          textAlign: "center",
          marginLeft: `${-(100 / count) / 2}%`,
          width: `${100 / count}%`,
          left: `${tick.percent}%`,
          color: secondarySubtitleText
        }}
      >
        {`${tick.value} ${labelText}`}
      </div>
    </div>
  );
}
