import "styles/components/App.styl";

import { ipcRenderer } from "electron";

import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { connect } from "react-redux";
import { autobind } from "core-decorators";

import { activePlaylist, currentIndex } from "selectors";
import { startPlaylist, stopPlaylist } from "actions";

import Playlist from "./Playlist";

class App extends React.Component {
  static propTypes = {
    start: PropTypes.func.isRequired,
    stop: PropTypes.func.isRequired,
    running: PropTypes.bool.isRequired,
    playlist: PropTypes.arrayOf(PropTypes.shape({
      exe: PropTypes.string.isRequired,
      duration: PropTypes.number.isRequired,
    })),
    current: PropTypes.number.isRequired,
  };

  state = {
    processes: [],
  };

  @autobind
  handleStartStop() {
    const { start, stop, running } = this.props;
    if (running) {
      stop();
    } else {
      start();
    }
  }

  handleShowConfig() {
    ipcRenderer.send("SHOW_CONFIG_WINDOW");
  }

  render() {
    const { running, playlist, current } = this.props;
    return (
      <div className="App">
        <button
          className={cn("App__start", {
            "is-running": running,
          })}
          type="button"
          onClick={this.handleStartStop}
        >
          {running ? "Running (Stop)" : "Click to start"}
        </button>
        <Playlist items={playlist} current={current} />
        <nav className="App__actions">
          <button
            className="App__actions__config"
            onClick={this.handleShowConfig}
          >
            Config
          </button>
        </nav>
      </div>
    );
  }
}

export { App };
export default connect(state => ({
  running: state.playback.running,
  playlist: activePlaylist(state),
  current: currentIndex(state),
}), dispatch => ({
  start: () => dispatch(startPlaylist()),
  stop: () => dispatch(stopPlaylist()),
}))(App);
