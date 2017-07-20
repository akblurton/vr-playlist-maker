import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import * as storage from "redux-storage";
import createEngine from "redux-storage-engine-electronjsonstorage";
import filter from "redux-storage-decorator-filter";

import electronStore from "electron-json-storage";

import reducer, { INITIAL_STATE } from "./reducer";
import saga from "./saga";


export default async function() {
  const data = {
    ...INITIAL_STATE,
    ...(await new Promise(resolve => {
      electronStore.getAll(function(err, response) {
        if (err) {
          resolve({});
        } else {
          try {
            const parsed = JSON.parse(response["vr-playlist-maker"]);
            resolve(parsed || {});
          } catch (e) {
            resolve({});
          }
        }
      });
    })),
  };
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

  const composeEnhancers = (
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  );
  const sagaMiddleware = createSagaMiddleware();
  const storageMiddleware = storage.createMiddleware(engine);

  storage.createLoader(engine);
  console.log(data);
  const store = createStore(
    storage.reducer(reducer),
    data,
    composeEnhancers(
      applyMiddleware(sagaMiddleware, storageMiddleware),
    )
  );

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

  return store;
}

