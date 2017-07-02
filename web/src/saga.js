import { all, take, race, call, select, put } from "redux-saga/effects";
import { delay } from "redux-saga";
import { send } from "helpers/ipc";

import * as actions from "./actions";
import { activePlaylist, config } from "./selectors";


const RETRIES = 3;
export function* processPlaylist() {
  const playlist = yield select(activePlaylist);
  if (!playlist) {
    // Error occurred
    return;
  }

  for (const { exe, duration } of playlist) {
    const { startNotice = false, warnings = [] } = yield select(config);
    // Start process
    if (startNotice) {
      console.log("START NOTICE");
    }
    let pid = null;
    for (let i = 0; i < RETRIES; i++) {
      try {
        pid = yield call(send, "START_PROCESS", [exe]);
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
    for (const { sound, time } of sortedWarnings) {
      // Calculate time to wait
      const t = duration - time  - accumulator;
      if (t < 0) {
        break; // Something went wrong, alert?
      }
      accumulator += t;
      yield call(delay, t);
      console.log(`Sending warning ${sound} ${time / 1000} seconds before end`);
    }

    // Wait for time to elapse
    yield call(delay, duration - accumulator);
    // Kill process
    yield call(send, "KILL_PROCESS", [pid]);

    const endedAt = Date.now();
    console.log(
      "Playlist item complete in ", endedAt - startedAt, "target:", duration
    );
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

export default function*() {
  yield all([
    call(startPlaylist),
  ]);
}
