import "styles/components/ConfigApp.styl";

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { autobind } from "core-decorators";

import ControlBar from "./ControlBar";

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
  handleSettingsChange(key) {
    const { config } = this.state;

    return ({ target: { value } }) => {
      this.setState({
        config: {
          ...config,
          [key]: value,
        },
      });
      this.updateStore(key, value);
    };
  }

  render() {
    const {
      config: {
        audioDevice,
        availableDevices,
        beforeDelay,
      },
    } = this.state;
    const {
      onAudioDeviceChange,
    } = this.props;
    return (
      <div className="ConfigApp">
        <ControlBar minimize={false} />
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
