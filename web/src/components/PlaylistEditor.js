import "styles/components/PlaylistEditor.styl";

import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { executable } from "helpers/formatting";

class PlaylistEditor extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      exe: PropTypes.string.isRequired,
      duration: PropTypes.number.isRequired,
    })),
    onRemove: PropTypes.func.isRequired,
    onSetTime: PropTypes.func.isRequired,
  };

  handleRemove(index) {
    return () => this.props.onRemove(index);
  }

  handleSetTime(index) {
    return ({ target: { value } }) => {
      this.props.onSetTime(index, parseFloat(value, 10) * 60000);
    };
  }

  render() {
    const { items } = this.props;
    return (
      <ol className="PlaylistEditor">
        {items.map((item, index) => (
          <li
            className={cn("PlaylistEditor__item")}
            key={index}
          >
            <div className="PlaylistEditor__item__row">
              <h2 className="PlaylistEditor__item__title" title={item.exe}>
                {executable(item.exe)}
              </h2>
            </div>
            <div className="PlaylistEditor__item__row">
              <label className="PlaylistEditor__item__field">
                <span className="PlaylistEditor__item__field__label">
                  Duration (minutes):
                </span>
                <input
                  type="number"
                  className="PlaylistEditor__item__duration"
                  min={1}
                  max={1000}
                  value={item.duration / 60000}
                  onChange={this.handleSetTime(index)}
                />
              </label>
              <nav className="PlaylistEditor__item__actions">
                <button
                  className="PlaylistEditor__item__actions__button
                             PlaylistEditor__item__actions__button--remove"
                  type="button"
                  title="Remove"
                  onClick={this.handleRemove(index)}
                />
              </nav>
            </div>
          </li>
        ))}
      </ol>
    );
  }
}

export default PlaylistEditor;
