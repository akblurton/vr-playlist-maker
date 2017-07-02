import "styles/components/EditorApp.styl";

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import ControlBar from "./ControlBar";
import { activePlaylist } from "selectors";

import PlaylistEditor from "components/PlaylistEditor";

class ConfigApp extends React.Component {
  static propTypes = {
    playlist: PropTypes.arrayOf(PropTypes.shape({
      exe: PropTypes.string.isRequired,
      duration: PropTypes.number.isRequired,
    })),
  };
  render() {
    const { playlist } = this.props;
    return (
      <div className="EditorApp">
        <ControlBar minimize={false} title="Playlist Editor" />
        <PlaylistEditor items={playlist} />
        <button className="EditorApp__add" type="button">
          Add
        </button>
      </div>
    );
  }
}

export { ConfigApp };
export default connect(state => ({
  playlist: activePlaylist(state),
}), () => ({

}))(ConfigApp);
