import * as actions from "./actions";

/* eslint-disable max-len */
import SECONDS_10 from "../audio/speech/application closing in 10 seconds-male.mp3";
import MINUTES_5 from "../audio/speech/application closing in 5 minutes-male.mp3";
import MINUTES_1 from "../audio/speech/application closing in 1 minute-male.mp3";
import START from "../audio/speech/starting application-male.mp3";
import END from "../audio/speech/playlist complete-male.mp3";
/* eslint-enable max-len */

const INITIAL_STATE = {
  playback: {
    running: false,
    index: -1,
  },
  playlist: [
    { exe: "audioshield.exe", duration: 15000 },
    { exe: "fruit_ninja.exe", duration: 15000 },
    { exe: "knockout_league.exe", duration: 15000 },
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
      { sound: MINUTES_5, time: 12000, volume: 50 },
      { sound: MINUTES_1, time: 8000, volume: 50 },
      { sound: SECONDS_10, time: 4000, volume: 50 },
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
