import ReactDOM from "react-dom";
import React from "react";

import store from "store";

import { AppContainer } from "react-hot-loader";
import App from "./components/App";
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
  module.hot.accept("./components/App", render);
}
