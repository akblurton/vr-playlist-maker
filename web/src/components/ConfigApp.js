import "styles/components/ConfigApp.styl";

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { setAudioDevice } from "actions";

class ConfigApp extends React.Component {
  static propTypes = {
    onAudioDeviceChange: PropTypes.func.isRequired,
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

  render() {
    const {
      config: {
        audioDevice,
        availableDevices,
      },
      onAudioDeviceChange,
    } = this.props;
    return (
      <div className="ConfigApp">
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
}))(ConfigApp);
