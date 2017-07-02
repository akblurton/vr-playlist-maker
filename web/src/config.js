import "./styles/global.styl";

import ReactDOM from "react-dom";
import React from "react";

import { createChild } from "helpers/redux";
import { INITIAL_STATE } from "reducer";
const store = createChild(INITIAL_STATE);

if (module.hot) {
  module.hot.accept("reducer", () => {});
}

import { AppContainer } from "react-hot-loader";
import App from "./components/ConfigApp";
import { Provider } from "react-redux";

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
  module.hot.accept("./components/ConfigApp", render);
}
