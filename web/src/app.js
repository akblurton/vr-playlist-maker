import "./styles/global.styl";

import ReactDOM from "react-dom";
import React from "react";

import store, { loading } from "store";
import { setMaster } from "helpers/redux";

import { AppContainer } from "react-hot-loader";
import App from "./components/App";
import { Provider } from "react-redux";

async function render() {
  await loading;
  setMaster(store);
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
