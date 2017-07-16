import "styles/components/Playlist.styl";

import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import { autobind } from "core-decorators";
import { time, executable } from "helpers/formatting";

class Playlist extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      exe: PropTypes.string.isRequired,
      duration: PropTypes.number.isRequired,
    })),
    current: PropTypes.number.isRequired,
  };

  _activeEl = null;

  @autobind
  setActive(ref) {
    if (ref) {
      this._activeEl = ref;
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.current !== this.props.current && this._activeEl) {
      // Scroll to show element
      this._activeEl.scrollIntoView(true);
    }
  }

  render() {
    const { items, current } = this.props;
    return (
      <ol className="Playlist">
        {items.map((item, index) => (
          <li
            className={cn("Playlist__item", {
              "is-active": current === index,
            })}
            key={index}
            ref={current === index ? this.setActive : null}
            title={item.name || item.exe}
          >
            {item.name || executable(item.exe)}
            <time className="Playlist__item__duration">
              {time(item.duration)}
            </time>
          </li>
        ))}
      </ol>
    );
  }
}

export default Playlist;
