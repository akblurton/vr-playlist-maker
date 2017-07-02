import "styles/components/App.styl";

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { startPlaylist } from "actions";

class App extends React.Component {
  static propTypes = {
    start: PropTypes.func.isRequired,
    running: PropTypes.bool.isRequired,
  };

  state = {
    processes: [],
  };

  render() {
    const { start, running } = this.props;
    return (
      <div className="App" onClick={start}>
        {running ? "Running" : "Click to start"}
      </div>
    );
  }
}

export { App };
export default connect(state => ({
  running: state.running,
}), dispatch => ({
  start: () => dispatch(startPlaylist()),
}))(App);
