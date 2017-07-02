import * as actions from "./actions";

import KLAXON from "../audio/klaxon.wav";
import BEEP from "../audio/beep.wav";
import BOOP from "../audio/boop.wav";
import START from "../audio/start.wav";
import END from "../audio/end.wav";

const INITIAL_STATE = {
  playback: {
    running: false,
    index: -1,
  },
  playlist: [
    { exe: "audioshield.exe", duration: 10000 },
    { exe: "fruit_ninja.exe", duration: 5000 },
    { exe: "knockout_league.exe", duration: 10000 },
  ],
  config: {
    audioDevice: null,
    startNotice: {
      sound: START,
      volume: 50,
    },
    endNotice: {
      sound: END,
      volume: 50,
    },
    warnings: [
      { sound: BEEP, time: 3000, volume: 50 },
      { sound: BOOP, time: 1000, volume: 50 },
      { sound: KLAXON, time: 300, volume: 50 },
    ],
  },
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actions.START_PLAYLIST:
      return {
        ...state,
        playback: {
          ...state.playback,
          running: true,
        },
      };
    case actions.SET_CURRENT_INDEX:
      return {
        ...state,
        playback: {
          ...state.playback,
          index: action.index,
        },
      };
    case actions.PLAYLIST_COMPLETE:
      return {
        ...state,
        playback: {
          ...state.playback,
          running: false,
          index: -1,
        },
      };
    default:
      return state;
  }
}
