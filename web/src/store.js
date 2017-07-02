import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import reducer from "./reducer";
import saga from "./saga";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(sagaMiddleware)
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

export default store;
