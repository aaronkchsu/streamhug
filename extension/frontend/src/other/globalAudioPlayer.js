const broadcastAudioHtmlTagId = "broadcast-audio-player";
const audioAudioHtmlTagId = "global-audio-player";

// HACK: Using these intead of the elements above because rerenders are causing some sort of weirdness with playing and stopping
let globalAudioVolume = 1;
let globalIsMuted = false;

export const getGlobalAudioPlayer = () => {
  return document.getElementById(broadcastAudioHtmlTagId);
};

export const setGlobalAudioPlayerMute = muted => {
  const audio = document.getElementById(broadcastAudioHtmlTagId);
  const global = document.getElementById(audioAudioHtmlTagId);
  audio.muted = muted;
  global.muted = muted;
  globalIsMuted = muted;
};

export const setGlobalAudioPlayerVolume = volume => {
  const audio = document.getElementById(broadcastAudioHtmlTagId);
  const global = document.getElementById(audioAudioHtmlTagId);
  audio.volume = volume;
  global.volume = volume;
  globalAudioVolume = volume;
};

// We use this method instead of this method so that muted is coontrolled by the global audio player
// const audio = new Audio(audioUrl);
// audio.play();
export const playGlobalAudioByUrl = audioUrl => {
  if(globalIsMuted) {
    return;
  }
  const audio = new Audio(audioUrl);
  audio.volume = globalAudioVolume
  audio.play();
};
