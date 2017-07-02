export const START_PLAYLIST = "START_PLAYLIST";
export const startPlaylist = () => ({
  type: START_PLAYLIST,
});

export const STOP_PLAYLIST = "STOP_PLAYLIST";
export const stopPlaylist = () => ({
  type: STOP_PLAYLIST,
});

export const PLAYLIST_COMPLETE = "PLAYLIST_COMPLETE";
export const playlistComplete = () => ({
  type: PLAYLIST_COMPLETE,
});

export const SET_CURRENT_INDEX = "SET_CURRENT_INDEX";
export const setCurrentIndex = index => ({
  type: SET_CURRENT_INDEX,
  index,
});
