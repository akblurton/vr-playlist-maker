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

export const UPDATE_AUDIO_DEVICES = "UPDATE_AUDIO_DEVICES";
export const updateAudioDevices = devices => ({
  type: UPDATE_AUDIO_DEVICES,
  devices,
});

export const SET_AUDIO_DEVICE = "SET_AUDIO_DEVICE";
export const setAudioDevice = device => ({
  type: SET_AUDIO_DEVICE,
  device,
});

export const SET_CONFIG_OPTION = "SET_CONFIG_OPTION";
export const setConfigOption = (key, value) => ({
  type: SET_CONFIG_OPTION,
  key,
  value,
});

export const ADD_TO_PLAYLIST = "ADD_TO_PLAYLIST";
export const addToPlaylist = (exe, name, icon, type) => ({
  type: ADD_TO_PLAYLIST,
  name,
  icon,
  exe,
  exeType: type,
});

export const REMOVE_FROM_PLAYLIST = "REMOVE_FROM_PLAYLIST";
export const removeFromPlaylist = index => ({
  type: REMOVE_FROM_PLAYLIST,
  index,
});

export const SET_PLAYLIST_ITEM_TIME = "SET_PLAYLIST_ITEM_TIME";
export const setPlaylistItemTime = (index, time) => ({
  type: SET_PLAYLIST_ITEM_TIME,
  index,
  time,
});

export const LOAD_OCULUS_LIBRARY = "LOAD_OCULUS_LIBRARY";
export function loadOculusLibrary() {
  return {
    type: LOAD_OCULUS_LIBRARY,
  };
}

export const LOAD_OCULUS_LIBRARY_COMPLETE = "LOAD_OCULUS_LIBRARY_COMPLETE";
export function loadOculusLibraryComplete(apps) {
  return {
    type: LOAD_OCULUS_LIBRARY_COMPLETE,
    apps,
  };
}


export const LOAD_STEAM_LIBRARY = "LOAD_STEAM_LIBRARY";
export function loadSteamLibrary() {
  return {
    type: LOAD_STEAM_LIBRARY,
  };
}

export const LOAD_STEAM_LIBRARY_COMPLETE = "LOAD_STEAM_LIBRARY_COMPLETE";
export function loadSteamLibraryComplete(apps) {
  return {
    type: LOAD_STEAM_LIBRARY_COMPLETE,
    apps,
  };
}


export const MOVE_ITEM = "MOVE_ITEM";
export function moveItem(index, direction) {
  return {
    type: MOVE_ITEM,
    index,
    direction,
  };
}
