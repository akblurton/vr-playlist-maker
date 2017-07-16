import "styles/components/OculusLibrary.styl";

/* eslint-disable react/jsx-no-bind */
import React from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import asURL from "file-url";
import { loadOculusLibrary } from "actions";

class OculusLibrary extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    apps: PropTypes.arrayOf(PropTypes.shape({
      icon: PropTypes.string.isRequired,
      id: PropTypes.string,
      exe: PropTypes.string,
      title: PropTypes.string,
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
    if (loading) {
      return (
        <div className="OculusLibrary">
          Loading...
        </div>
      );
    }
    return (
      <ul
        className={cn("OculusLibrary", {
          "is-loading": loading,
        })}
      >
        <li
          className="OculusLibrary__app"
          onClick={() => onSelect(null)}
        >
          Cancel
        </li>
        {apps.map(app => (
          <li
            className="OculusLibrary__app"
            key={app.id}
            onClick={() => onSelect(app.exe)}
          >
            <img
              src={asURL(app.icon, { resolve: false })}
              alt={app.title || app.installDir.split(/[\\/]/).slice(-1)[0]}
              title={app.title || app.installDir.split(/[\\/]/).slice(-1)[0]}
            />
            <h3 className="OculusLibrary__app__title">
              {app.title}
            </h3>
          </li>
        ))}
      </ul>
    );
  }
}

export { OculusLibrary };
export default connect(state => ({
  apps: state.oculus.apps,
  loading: state.oculus.loading,
}), dispatch => ({
  load: () => dispatch(loadOculusLibrary()),
}))(OculusLibrary);
