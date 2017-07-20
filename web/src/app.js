import "./styles/global.styl";

import ReactDOM from "react-dom";
import React from "react";

import createStore from "store";
import { setMaster } from "helpers/redux";

import { AppContainer } from "react-hot-loader";
import App from "./components/App";
import { Provider } from "react-redux";

async function start() {
  const store = await createStore();
  setMaster(store);

  function render() {
    ReactDOM.render(
      <AppContainer>
        <Provider store={store}>
          <App />
        </Provider>
      </AppContainer>,
      document.getElementById("app")
    );
  }

  render();
  if (module.hot) {
    module.hot.accept("./components/App", render);
  }
}

start();

