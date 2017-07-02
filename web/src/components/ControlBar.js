import "styles/components/ControlBar.styl";

import React from "react";
import PropTypes from "prop-types";
import { remote } from "electron";

class ControlBar extends React.Component {
  static propTypes = {
    minimize: PropTypes.bool,
  };

  static defaultProps = {
    minimize: true,
  };

  handleMinimize() {
    remote.getCurrentWindow().minimize();
  }

  handleClose() {
    remote.getCurrentWindow().close();
  }

  render() {
    const { minimize } = this.props;
    return (
      <header className="ControlBar">
        {minimize && (
          <button
            className="ControlBar__action ControlBar__action--minimize"
            onClick={this.handleMinimize}
            type="button"
          >
            -
          </button>
        )}
        <button
          className="ControlBar__action ControlBar__action--close"
          onClick={this.handleClose}
          type="button"
        >
          X
        </button>
      </header>
    );
  }
}

export default ControlBar;
