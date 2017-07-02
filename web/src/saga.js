import { all, take, race, call, select, put } from "redux-saga/effects";
import { delay } from "redux-saga";
import { send } from "helpers/ipc";

import * as actions from "./actions";
import { activePlaylist } from "./selectors";


const RETRIES = 3;
export function* processPlaylist() {
  const playlist = yield select(activePlaylist);
  if (!playlist) {
    // Error occurred
    return;
  }

  for (const { exe, duration } of playlist) {
    // Start process
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

    // Wait for time to elapse
    yield call(delay, duration);
    // Kill process
    yield call(send, "KILL_PROCESS", [pid]);
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
