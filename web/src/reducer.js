import * as actions from "./actions";

import { set } from "object-path";
import deepclone from "deepclone";
import audioClips from "assets";

const TEN_MINUTES = 1000 * 60 * 10;

export const INITIAL_STATE = {
  playback: {
    running: false,
    index: -1,
  },
  playlist: [
    { exe: "audioshield.exe", duration: TEN_MINUTES },
    { exe: "fruit_ninja.exe", duration: TEN_MINUTES },
    { exe: "knockout_league.exe", duration: TEN_MINUTES },
  ],
  config: {
    availableDevices: [],
    audioDevice: null,
    beforeDelay: 0,
    startNotice: {
      enabled: true,
      sound: audioClips.speech.male.starting_application.value,
      volume: 50,
    },
    endNotice: {
      enabled: true,
      sound: audioClips.speech.male.playlist_complete.value,
      volume: 50,
    },
    warnings: [
      {
        sound: audioClips.speech.male.application_closing_in_5_minutes.value,
        time: 12000,
        volume: 50,
        enabled: true,
      },
      {
        sound: audioClips.speech.male.application_closing_in_1_minute.value,
        time: 8000,
        volume: 50,
        enabled: true,
      },
      {
        sound: audioClips.speech.male.application_closing_in_10_seconds.value,
        time: 4000,
        volume: 50,
        enabled: true,
      },
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
    case actions.SET_AUDIO_DEVICE:
      return {
        ...state,
        config: {
          ...state.config,
          audioDevice: action.device,
        },
      };
    case actions.UPDATE_AUDIO_DEVICES:
      return {
        ...state,
        config: {
          ...state.config,
          availableDevices: action.devices,
        },
      };
    case actions.SET_CONFIG_OPTION: {
      const merge = deepclone(state.config);
      set(merge, action.key, action.value);
      return {
        ...state,
        config: merge,
      };
    }
    case actions.ADD_TO_PLAYLIST:
      return {
        ...state,
        playlist: [
          ...state.playlist, {
            exe: action.exe,
            duration: TEN_MINUTES,
          },
        ],
      };
    default:
      return state;
  }
}
