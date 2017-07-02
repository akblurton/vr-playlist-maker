import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import * as storage from "redux-storage";
import createEngine from "redux-storage-engine-electronjsonstorage";
import filter from "redux-storage-decorator-filter";


import reducer from "./reducer";
import saga from "./saga";

let engine;
// Right now, don't save the config in dev mode
if (process.env.NODE_ENV === "development") {
  engine = filter(createEngine("vr-playlist-maker"), null, [
    "playback",
    "config",
  ]);
} else {
  engine = filter(createEngine("vr-playlist-maker"), null, [
    "playback",
  ]);
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();
const storageMiddleware = storage.createMiddleware(engine);

const load = storage.createLoader(engine);

const store = createStore(
  storage.reducer(reducer),
  composeEnhancers(
    applyMiddleware(sagaMiddleware, storageMiddleware),
  )
);
load(store);

let task = sagaMiddleware.run(saga);


if (module.hot) {
  module.hot.accept("./reducer", function() {
    store.replaceReducer(reducer);
  });
  module.hot.accept("./saga", function() {
    task.cancel();
    task = sagaMiddleware.run(saga);
  });
}

export default store;
