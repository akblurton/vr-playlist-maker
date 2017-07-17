import "styles/components/Thumbnail.styl";

import React from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { autobind } from "core-decorators";

const errored = {};

class Thumbnail extends React.Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
  };

  state = {
    error: false,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.src !== this.props.src) {
      this.setState({
        error: false,
      });
    }
  }

  componentWillMount() {
    if (this.props.src in errored) {
      this.setState({
        error: true,
      });
    }
  }

  @autobind
  handleError() {
    errored[this.props.src] = true;
    this.setState({
      error: true,
    });
  }

  render() {
    const { error } = this.state;
    return (
      <div
        className={cn("Thumbnail", {
          "has-error": error,
        })}
      >
        <img {...this.props} onError={this.handleError} />
      </div>
    );
  }
}

export default Thumbnail;
