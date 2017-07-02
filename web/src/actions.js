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
