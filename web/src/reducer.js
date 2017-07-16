import * as actions from "./actions";

import { set } from "object-path";
import deepclone from "deepclone";
import audioClips from "assets";

const TEN_MINUTES = 1000 * 60 * 10;

export const INITIAL_STATE = {
  oculus: {
    apps: [],
    loading: false,
  },
  playback: {
    running: false,
    index: -1,
  },
  playlist: [
    { exe: "./example-processes/test1.sh", duration: TEN_MINUTES },
    { exe: "./example-processes/test2.sh", duration: TEN_MINUTES },
    { exe: "./example-processes/test3.sh", duration: TEN_MINUTES },
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
    case actions.REMOVE_FROM_PLAYLIST:
      return {
        ...state,
        playlist: state.playlist.filter((_, i) => i !== action.index),
      };
    case actions.SET_PLAYLIST_ITEM_TIME:
      return {
        ...state,
        playlist: state.playlist.map((step, index) => (
          index === action.index ? {
            ...step,
            duration: action.time,
          } : step
        )),
      };
    case actions.LOAD_OCULUS_LIBRARY:
      return {
        ...state,
        oculus: {
          ...state.oculus,
          apps: [],
          loading: true,
        },
      };
    case actions.LOAD_OCULUS_LIBRARY_COMPLETE:
      return {
        ...state,
        oculus: {
          ...state.oculus,
          apps: action.apps,
          loading: false,
        },
      };
    default:
      return state;
  }
}
