import {
  all, take, race, call, select, put, takeLatest,
} from "redux-saga/effects";
import { delay } from "redux-saga";
import { send } from "helpers/ipc";

import * as actions from "./actions";
import { activePlaylist, config, audioDevice } from "./selectors";
import { getAudioDevices, buildAudioElements } from "helpers/media";

const RETRIES = 3;
export function* processPlaylist() {
  const playlist = yield select(activePlaylist);
  const {
    startNotice = false,
    endNotice = false,
    warnings = [],
    audioDevice = null,
    beforeDelay = 0,
  } = yield select(config);
  if (!playlist) {
    // Error occurred
    return;
  }

  const warningSounds = yield call(buildAudioElements, warnings, audioDevice);
  const [endSound] = yield call(
    buildAudioElements, [endNotice], audioDevice
  );
  const [startSound] = yield call(
    buildAudioElements, [startNotice], audioDevice
  );
  for (const [index, { exe, duration, type }] of playlist.entries()) {
    if (startNotice.enabled) {
      yield call([startSound, startSound.play]);
    }

    yield put(actions.setCurrentIndex(index));

    // Start process
    let pid = null;
    for (let i = 0; i < RETRIES; i++) {
      try {
        const msg = type === "steam" ? "START_STEAM_PROCESS" : "START_PROCESS";
        pid = yield call(send, msg, [exe]);
        break;
      } catch (e) {
        // ignore and try again
      }
    }

    if (!pid) {
      // error occured
      return;
    }

    const startedAt = Date.now();
    const sortedWarnings = [...warnings].sort((a, b) => (
      b.time - a.time // Large times first
    ));

    let accumulator = 0; // Keep track of time spent so far
    for (const [index, { sound, time, enabled }] of sortedWarnings.entries()) {
      if (!enabled) {
        continue;
      }
      // Calculate time to wait
      const t = duration - time  - accumulator;
      if (t <= 0) {
        continue; // Item is before start time
      }
      accumulator += t;
      yield call(delay, t);
      if (warningSounds[index]) {
        try {
          yield call([warningSounds[index], warningSounds[index].play]);
        } catch (e) {
          // Audio problem
          console.warn("Audio playback failed");
        }
      }
      console.log(`Sending warning ${sound} ${time / 1000} seconds before end`);
    }

    // Wait for time to elapse
    yield call(delay, Math.max(0, duration - accumulator));
    // Kill process
    for (let i = 0; i < RETRIES; i++) {
      try {
        const msg = type === "steam" ? "KILL_STEAM_PROCESS" : "KILL_PROCESS";
        yield call(send, msg, [pid]);
        break;
      } catch (e) {
        // ignore
      }
    }

    const endedAt = Date.now();
    console.log(
      "Playlist item complete in ", endedAt - startedAt, "target:", duration
    );

    // Wait specified time between apps to allow for shutdown
    console.log("Waiting ", beforeDelay, "s until opening next app");
    yield call(delay, beforeDelay * 1000);
  }
  if (endNotice.enabled) {
    yield call([endSound, endSound.play]);
  }
}

export function* startPlaylist() {
  while (true) { // eslint-disable-line no-constant-condition
    yield take(actions.START_PLAYLIST);
    yield race([
      call(processPlaylist),
      take(actions.STOP_PLAYLIST),
    ]);
    yield put(actions.playlistComplete());
  }
}

// Look for the following in this order if default device has not yet been set
const DEFAULT_AUDIO_CHOICE = [
  "Rift (Rift Audio)",
  "HTC-VIVE-0",
  "Default",
];
export function* bootstrap() {
  const devices = yield call(getAudioDevices);
  yield put(actions.updateAudioDevices(devices));
  const currentDevice = yield select(audioDevice);
  if (currentDevice === null) {
    for (const lookup of DEFAULT_AUDIO_CHOICE) {
      const found = devices.find(({ label }) => (
        (label || "").toLowerCase() === lookup.toLowerCase()
      ));
      if (found) {
        yield put(actions.setAudioDevice(found.deviceId));
        break;
      }
    }
  }
}

export function* loadOculusLibrary() {
  try {
    const oculusGames = yield call(send, "GET_OCULUS_LIBRARY");
    yield put(actions.loadOculusLibraryComplete(oculusGames));
  } catch (e) {
    // Ignore
  }
}

export function* loadSteamLibrary() {
  try {
    const steamGames = yield call(send, "GET_STEAM_LIBRARY");
    yield put(actions.loadSteamLibraryComplete(steamGames));
  } catch (e) {
    // Ignore
  }
}

export default function*() {
  yield all([
    call(bootstrap),
    call(startPlaylist),
    takeLatest(actions.LOAD_OCULUS_LIBRARY, loadOculusLibrary),
    takeLatest(actions.LOAD_STEAM_LIBRARY, loadSteamLibrary),
  ]);
}
