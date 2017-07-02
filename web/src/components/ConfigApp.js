import "styles/components/ConfigApp.styl";

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { autobind } from "core-decorators";

import ControlBar from "./ControlBar";
import AudioSelector from "./AudioSelector";

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
    const {
      config: {
        audioDevice,
        availableDevices,
        beforeDelay,
        startNotice,
        endNotice,
        warnings,
      },
    } = this.state;
    const {
      onAudioDeviceChange,
    } = this.props;
    return (
      <div className="ConfigApp">
        <ControlBar minimize={false} title="Options" />
        <label className="ConfigApp__field">
          <span className="ConfigApp__field__label">
            Delay between applications
          </span>
          <div className="ConfigApp__field__row">
            <input
              className="ConfigApp__field__control"
              type="range"
              onChange={this.handleSettingsChange("beforeDelay")}
              value={beforeDelay || 0}
              min={0}
              max={20}
              step={1}
            />
            <span className="ConfigApp__field__value">
              {beforeDelay}s
            </span>
          </div>
        </label>
        <label className="ConfigApp__field">
          <span className="ConfigApp__field__label">
            Output audio notifications to:
          </span>
          <select
            className="ConfigApp__field__control"
            value={audioDevice || ""}
            onChange={onAudioDeviceChange}
          >
            {availableDevices.map(device => (
              <option value={device.deviceId} key={device.deviceId}>
                {device.label}
              </option>
            ))}
          </select>
        </label>
        <label className="ConfigApp__field">
          <span className="ConfigApp__field__label">
            Notify when starting an application:
          </span>
          <div className="ConfigApp__field__row">
            <input
              type="checkbox"
              className="ConfigApp__field__control
                         ConfigApp__field__control--checkbox"
              value="enabled"
              checked={startNotice.enabled || false}
              onChange={this.handleSettingsToggle("startNotice.enabled")}
            />
            <AudioSelector
              onChange={this.handleSettingsChange("startNotice.sound")}
              onVolumeChange={this.handleSettingsChange("startNotice.volume")}
              value={startNotice.sound}
              volume={startNotice.volume}
            />
          </div>
        </label>
        <label className="ConfigApp__field">
          <span className="ConfigApp__field__label">
            Notify when playlist completed:
          </span>
          <div className="ConfigApp__field__row">
            <input
              type="checkbox"
              className="ConfigApp__field__control
                         ConfigApp__field__control--checkbox"
              value=""
              checked={endNotice.enabled || false}
              onChange={this.handleSettingsToggle("endNotice.enabled")}
            />
            <AudioSelector
              onChange={this.handleSettingsChange("endNotice.sound")}
              onVolumeChange={this.handleSettingsChange("endNotice.volume")}
              value={endNotice.sound}
              volume={endNotice.volume}
            />
          </div>
        </label>
        <label className="ConfigApp__field">
          <span className="ConfigApp__field__label">
            Notify when 5 minutes remain:
          </span>
          <div className="ConfigApp__field__row">
            <input
              type="checkbox"
              className="ConfigApp__field__control
                         ConfigApp__field__control--checkbox"
              value="enabled"
              checked={warnings[0].enabled || false}
              onChange={this.handleSettingsToggle("warnings.0.enabled")}
            />
            <AudioSelector
              onChange={this.handleSettingsChange("warnings.0.sound")}
              onVolumeChange={this.handleSettingsChange("warnings.0.volume")}
              value={warnings[0].sound}
              volume={warnings[0].volume}
            />
          </div>
        </label>
        <label className="ConfigApp__field">
          <span className="ConfigApp__field__label">
            Notify when 1 minute remains:
          </span>
          <div className="ConfigApp__field__row">
            <input
              type="checkbox"
              className="ConfigApp__field__control
                         ConfigApp__field__control--checkbox"
              value="enabled"
              checked={warnings[1].enabled || false}
              onChange={this.handleSettingsToggle("warnings.1.enabled")}
            />
            <AudioSelector
              onChange={this.handleSettingsChange("warnings.1.sound")}
              onVolumeChange={this.handleSettingsChange("warnings.1.volume")}
              value={warnings[1].sound}
              volume={warnings[1].volume}
            />
          </div>
        </label>
        <label className="ConfigApp__field">
          <span className="ConfigApp__field__label">
            Notify when 10 seconds remain:
          </span>
          <div className="ConfigApp__field__row">
            <input
              type="checkbox"
              className="ConfigApp__field__control
                         ConfigApp__field__control--checkbox"
              value="enabled"
              checked={warnings[2].enabled || false}
              onChange={this.handleSettingsToggle("warnings.2.enabled")}
            />
            <AudioSelector
              onChange={this.handleSettingsChange("warnings.2.sound")}
              onVolumeChange={this.handleSettingsChange("warnings.2.volume")}
              value={warnings[2].sound}
              volume={warnings[2].volume}
            />
          </div>
        </label>
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
