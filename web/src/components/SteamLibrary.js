import "styles/components/SteamLibrary.styl";

/* eslint-disable react/jsx-no-bind */
import React from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import asURL from "file-url";
import { loadSteamLibrary } from "actions";
import Thumbnail from "./Thumbnail";

class SteamLibrary extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    apps: PropTypes.arrayOf(PropTypes.shape({
      icon: PropTypes.string,
      id: PropTypes.string,
      exe: PropTypes.string,
      name: PropTypes.string,
    })),
    onSelect: PropTypes.func,
    load: PropTypes.func,
  };

  static defaultProps = {
    apps: [],
    onSelect: () => {},
    load: () => {},
  };

  componentWillMount() {
    this.props.load();
  }

  render() {
    const { loading, apps, onSelect } = this.props;
    return (
      <ul
        className={cn("SteamLibrary", {
          "is-loading": loading,
        })}
      >
        <li
          className="SteamLibrary__app"
          onClick={() => onSelect(null)}
        >
          Cancel
        </li>
        {apps.map(app => (
          <li
            className="SteamLibrary__app"
            key={app.id}
            onClick={() => onSelect(
              { id: app.id, exe: app.exe }, app.name, app.icon
            )}
          >
            <Thumbnail
              src={asURL(app.icon, { resolve: false })}
              alt={app.name || app.dir.split(/[\\/]/).slice(-1)[0]}
              title={app.name || app.dir.split(/[\\/]/).slice(-1)[0]}
            />
            <h3 className="SteamLibrary__app__title">
              {app.name}
            </h3>
          </li>
        ))}
      </ul>
    );
  }
}

export { SteamLibrary };
export default connect(state => ({
  apps: state.steam.apps,
  loading: state.steam.loading,
}), dispatch => ({
  load: () => dispatch(loadSteamLibrary()),
}))(SteamLibrary);
