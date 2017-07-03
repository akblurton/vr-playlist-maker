import "styles/components/EditorApp.styl";

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import ControlBar from "./ControlBar";
import { activePlaylist } from "selectors";
import { addToPlaylist, removeFromPlaylist } from "actions";

import PlaylistEditor from "components/PlaylistEditor";
import { autobind } from "core-decorators";

class EditorApp extends React.Component {
  static propTypes = {
    playlist: PropTypes.arrayOf(PropTypes.shape({
      exe: PropTypes.string.isRequired,
      duration: PropTypes.number.isRequired,
    })),
    onAdd: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
  };

  _fileInput = null;

  @autobind
  bindPicker(ref) {
    this._fileInput = ref;
  }

  @autobind
  handleAdd() {
    if (this._fileInput) {
      this._fileInput.click();
    }
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

  render() {
    const { playlist, onRemove } = this.props;
    return (
      <div className="EditorApp">
        <ControlBar minimize={false} title="Playlist Editor" />
        <PlaylistEditor items={playlist} onRemove={onRemove} />
        <input
          defaultValue=""
          type="file"
          className="EditorApp__file"
          ref={this.bindPicker}
          onChange={this.handleFilePicked}
        />
        <button
          className="EditorApp__add"
          type="button"
          onClick={this.handleAdd}
        >
          Add
        </button>
      </div>
    );
  }
}

export { EditorApp };
export default connect(state => ({
  playlist: activePlaylist(state),
}), dispatch => ({
  onAdd: url => dispatch(addToPlaylist(url)),
  onRemove: id => dispatch(removeFromPlaylist(id)),
}))(EditorApp);
