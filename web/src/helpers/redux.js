// Create a synced reducer between renderers, with a single
// master store, and many slaves

import { createStore, applyMiddleware, compose } from "redux";
import { remote, ipcRenderer } from "electron";

let subscription = null;
let master = null;

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

let timeout = null;
export const childDispatch = action => {
  clearTimeout(timeout);
  timeout = setTimeout(function() {
    sendAll("__REDUX_ACTION", action);
  }, 100);
};

export const childMiddleware = () => next => action => {
  if (action.type === "__REDUX_UPDATED") {
    return next(action);
  }
  childDispatch(action);
  return next(action);
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export function createChild(reducer) {
  const store = createStore(function(state, action) {
    if (action.state) {
      return action.state;
    }
    return reducer(state, action);
  }, composeEnhancers(applyMiddleware(childMiddleware)));

  ipcRenderer.on("__REDUX_UPDATED", (event, state) => {
    store.dispatch({ state, type: "__REDUX_UPDATED" });
  });
  sendAll("__REDUX_CHILD_CREATED");

  const rr = ::store.replaceReducer;
  return {
    ...store,
    replaceReducer(reducer) {
      rr(function(state, action) {
        if (action.state) {
          return action.state;
        }
        return reducer(state, action);
      });
    },
  };
}
