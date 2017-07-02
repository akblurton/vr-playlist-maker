import "styles/components/AudioSelector.styl";
import React from "react";
import PropTypes from "prop-types";
import { autobind } from "core-decorators";
import audioClips from "assets";

class AudioSelector extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onVolumeChange: PropTypes.func.isRequired,
    value: PropTypes.string,
    volume: PropTypes.number,
  };

  _audio = null;

  @autobind
  async handlePreview() {
    const { value } = this.props;
    if (!this._audio) {
      return;
    }

    try {
      await this._audio.play();
    } catch (e) {
      alert(`Could not play audio file "${value}"`);
    }
  }

  @autobind
  bindAudio(ref) {
    const { volume } = this.props;
    this._audio = ref;
    if (this._audio) {
      this._audio.volume = volume / 100;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.volume !== this.props.volume && this._audio) {
      this._audio.volume = nextProps.volume / 100;
    }
  }

  render() {
    const { onChange, value, volume, onVolumeChange } = this.props;
    return (
      <div className="AudioSelector">
        <div className="AudioSelector__row">
          <select
            className="AudioSelector__control"
            onChange={onChange}
            value={value}
          >
            <optgroup label="Sound Effects">
              {Object.values(audioClips.effects).map(({ value, label }) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Voice Synth - Male">
              {Object.values(audioClips.speech.male).map(({ value, label }) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Voice Synth - Female">
              {Object.values(audioClips.speech.female).map(
                ({ value, label }) => (
                  <option value={value} key={value}>
                    {label}
                  </option>
                )
              )}
            </optgroup>
            <optgroup label="Voice Synth Google">
              {Object.values(audioClips.speech.google).map(
                ({ value, label }) => (
                  <option value={value} key={value}>
                    {label}
                  </option>
                )
              )}
            </optgroup>
          </select>
          {value && (
            <audio
              ref={this.bindAudio}
              src={value}
            />
          )}
          <button
            className="AudioSelector__preview"
            onClick={this.handlePreview}
            title="Preview sound"
          >
            Preview
          </button>
        </div>
        <div className="AudioSelector__row">
          <input
            type="range"
            className="AudioSelector__control"
            min={0}
            max={100}
            value={volume}
            onChange={onVolumeChange}
          />
        </div>
      </div>
    );
  }
}

export default AudioSelector;
