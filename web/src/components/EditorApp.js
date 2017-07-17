import "styles/components/EditorApp.styl";

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import ControlBar from "./ControlBar";
import { activePlaylist } from "selectors";
import {
  addToPlaylist, removeFromPlaylist, setPlaylistItemTime,
} from "actions";

import PlaylistEditor from "components/PlaylistEditor";
import OculusLibrary from "components/OculusLibrary";
import SteamLibrary from "components/SteamLibrary";
import { autobind } from "core-decorators";

class EditorApp extends React.Component {
  static propTypes = {
    playlist: PropTypes.arrayOf(PropTypes.shape({
      exe: PropTypes.string.isRequired,
      duration: PropTypes.number.isRequired,
    })),
    onAdd: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onSetTime: PropTypes.func.isRequired,
  };

  _fileInput = null;
  state = {
    selectorOpen: false,
    oculusSelectorOpen: false,
    steamSelectorOpen: false,
  };

  @autobind
  bindPicker(ref) {
    this._fileInput = ref;
  }

  @autobind
  handleAdd() {
    this.setState({
      selectorOpen: !this.state.selectorOpen,
      oculusSelectorOpen: false,
      steamSelectorOpen: false,
    });
  }

  @autobind
  handleFileBrowse() {
    if (this._fileInput) {
      this._fileInput.click();
    }
    this.setState({
      selectorOpen: false,
      oculusSelectorOpen: false,
      steamSelectorOpen: false,
    });
  }

  @autobind
  handleOculusBrowse() {
    this.setState({
      selectorOpen: false,
      oculusSelectorOpen: true,
      steamSelectorOpen: false,
    });
  }

  @autobind
  handleSteamBrowse() {
    this.setState({
      selectorOpen: false,
      oculusSelectorOpen: false,
      steamSelectorOpen: true,
    });
  }

  @autobind
  handleFilePicked() {
    if (!this._fileInput) {
      return;
    }

    const [file] = this._fileInput.files;
    if (!file) {
      return;
    }
    this._fileInput.value = "";
    this.props.onAdd(file.path);
  }

  @autobind
  handleOculusSelect(exe, name, icon) {
    this.setState({
      oculusSelectorOpen: false,
    });
    if (exe === null) {
      return;
    }
    this.props.onAdd(exe, name, icon);
  }

  @autobind
  handleSteamSelect(exe, name, icon) {
    this.setState({
      steamSelectorOpen: false,
    });
    if (exe === null) {
      return;
    }
    this.props.onAdd(exe, name, icon, "steam");
  }

  render() {
    const { playlist, onRemove, onSetTime } = this.props;
    const { selectorOpen, oculusSelectorOpen, steamSelectorOpen } = this.state;
    return (
      <div className="EditorApp">
        <ControlBar minimize={false} title="Playlist Editor" />
        <PlaylistEditor
          items={playlist}
          onRemove={onRemove}
          onSetTime={onSetTime}
        />
        <input
          defaultValue=""
          type="file"
          className="EditorApp__file"
          ref={this.bindPicker}
          onChange={this.handleFilePicked}
        />
        {selectorOpen && (
          <nav className="EditorApp__selector">
            <button
              className="EditorApp__selector__option
                         EditorApp__selector__option--file"
              onClick={this.handleFileBrowse}
            >
              Browse for .exe
            </button>
            <button
              className="EditorApp__selector__option
                         EditorApp__selector__option--oculus"
              onClick={this.handleOculusBrowse}
            >
              Search Oculus Library
            </button>
            <button
              className="EditorApp__selector__option
                         EditorApp__selector__option--steam"
              onClick={this.handleSteamBrowse}
            >
              Search Steam Library
            </button>
          </nav>
        )}
        <button
          className="EditorApp__add"
          type="button"
          onClick={this.handleAdd}
        >
          Add
        </button>
        {oculusSelectorOpen && (
          <OculusLibrary onSelect={this.handleOculusSelect} />
        )}
        {steamSelectorOpen && (
          <SteamLibrary onSelect={this.handleSteamSelect} />
        )}
      </div>
    );
  }
}

export { EditorApp };
export default connect(state => ({
  playlist: activePlaylist(state),
}), dispatch => ({
  onAdd: (...args) => dispatch(addToPlaylist(...args)),
  onRemove: id => dispatch(removeFromPlaylist(id)),
  onSetTime: (id, time) => dispatch(setPlaylistItemTime(id, time)),
}))(EditorApp);
