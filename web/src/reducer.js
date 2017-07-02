import * as actions from "./actions";

import KLAXON from "../audio/klaxon.wav";
import BEEP from "../audio/beep.wav";
import BOOP from "../audio/boop.wav";
import START from "../audio/start.wav";
import END from "../audio/end.wav";

const INITIAL_STATE = {
  running: false,
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
      { sound: BEEP, time: 3000 },
      { sound: BOOP, time: 1000 },
      { sound: KLAXON, time: 300 },
    ],
  },
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actions.START_PLAYLIST:
      return {
        ...state,
        running: true,
      };
    case actions.PLAYLIST_COMPLETE:
      return {
        ...state,
        running: false,
      };
    default:
      return state;
  }
}
