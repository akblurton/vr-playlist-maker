import * as actions from "./actions";

const INITIAL_STATE = {
  running: false,
  playlist: [
    { exe: "audioshield.exe", duration: 10000 },
    { exe: "fruit_ninja.exe", duration: 5000 },
    { exe: "knockout_league.exe", duration: 10000 },
  ],
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
