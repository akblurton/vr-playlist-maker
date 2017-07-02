// Create a synced reducer between renderers, with a single
// master store, and many slaves

import { createStore, applyMiddleware, compose } from "redux";
import { remote, ipcRenderer } from "electron";

let subscription = null;
let master = null;

let lastState = {};
ipcRenderer.on("__REDUX_UPDATED", function(event, state) {
  lastState = state;
});

export function sendAll(...args) {
  const windows = remote.BrowserWindow.getAllWindows();
  for (const win of windows) {
    win.webContents.send(...args);
  }
}

export function updateSlaves() {
  if (!master) {
    return;
  }
  const state = master.getState();
  sendAll("__REDUX_UPDATED", state);
}

export function setMaster(store) {
  if (subscription) {
    subscription(); // Cancel existing subscription
  }
  subscription = store.subscribe(updateSlaves);
  master = store;
  ipcRenderer.on("__REDUX_ACTION", (event, action) => {
    master.dispatch(action);
  });
  ipcRenderer.on("__REDUX_CHILD_CREATED", updateSlaves);
  updateSlaves();
}

export const childMiddleware = () => next => action => {
  if (action.type === "__REDUX_UPDATED") {
    return next(action);
  }
  sendAll("__REDUX_ACTION", action);
  return next(action);
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export function createChild(defaultState = lastState) {
  const store = createStore(function(state = defaultState, action) {
    if (action.state) {
      return action.state;
    }
    return state;
  }, composeEnhancers(applyMiddleware(childMiddleware)));

  ipcRenderer.on("__REDUX_UPDATED", (event, state) => {
    store.dispatch({ state, type: "__REDUX_UPDATED" });
  });
  sendAll("__REDUX_CHILD_CREATED");

  return store;
}
