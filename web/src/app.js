import ReactDOM from "react-dom";
import React from "react";

import { AppContainer } from "react-hot-loader";
import App from "./components/App";

function render() {
  ReactDOM.render(
    <AppContainer>
      <App />
    </AppContainer>,
    document.getElementById("app")
  );
}

render();
if (module.hot) {
  module.hot.accept("./components/App", render);
}
