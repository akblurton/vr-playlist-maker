import "styles/components/EditorApp.styl";

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { autobind } from "core-decorators";

import ControlBar from "./ControlBar";

import { set } from "object-path";
import deepclone from "deepclone";

import { setAudioDevice, setConfigOption } from "actions";
class ConfigApp extends React.Component {
  static propTypes = {
    onAudioDeviceChange: PropTypes.func.isRequired,
    onSettingsChange: PropTypes.func.isRequired,
    config: PropTypes.shape({
      audioDevice: PropTypes.string,
      availableDevices: PropTypes.arrayOf(PropTypes.shape({
        deviceId: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
      })),
      startNotice: PropTypes.shape({
        enabled: PropTypes.bool.isRequired,
        sound: PropTypes.string.isRequired,
        volume: PropTypes.number,
      }).isRequired,
      endNotice: PropTypes.shape({
        enabled: PropTypes.bool.isRequired,
        sound: PropTypes.string.isRequired,
        volume: PropTypes.number,
      }).isRequired,
      warnings: PropTypes.arrayOf(PropTypes.shape({
        sound: PropTypes.string.isRequired,
        time: PropTypes.number,
        volume: PropTypes.number,
      })).isRequired,
    }).isRequired,
  };

  state = {
    config: {},
  };

  timeouts = {};

  componentWillMount() {
    this.setState({
      config: this.props.config,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      config: nextProps.config,
    });
  }

  updateStore(key, value) {
    if (key in this.timeouts) {
      clearTimeout(this.timeouts[key]);
    }
    const { onSettingsChange } = this.props;
    this.timeouts[key] = setTimeout(() => {
      onSettingsChange(key, value);
    }, 100);
  }

  @autobind
  handleSettingsToggle(key) {
    const { config } = this.state;

    return ({ target: { checked } }) => {
      const merge = deepclone(config);
      set(merge, key, !!checked),
      this.setState({ config: merge });
      this.updateStore(key, !!checked);
    };
  }

  @autobind
  handleSettingsChange(key) {
    const { config } = this.state;

    return ({ target: { value } }) => {
      const merge = deepclone(config);
      set(merge, key, value),
      this.setState({ config: merge });
      this.updateStore(key, value);
    };
  }

  render() {
    return (
      <div className="EditorApp">
        <ControlBar minimize={false} />
      </div>
    );
  }
}

export { ConfigApp };
export default connect(state => ({
  config: state.config,
}), dispatch => ({
  onAudioDeviceChange: ({ target: { value } }) => dispatch(
    setAudioDevice(value)
  ),
  onSettingsChange: (key, value) => dispatch(
    setConfigOption(key, value),
  ),
}))(ConfigApp);
