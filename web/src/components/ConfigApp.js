import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { currentIndex } from "selectors";

class ConfigApp extends React.Component {
  static propTypes = {
    current: PropTypes.number.isRequired,
  };

  state = {
    processes: [],
  };

  render() {
    const { current } = this.props;
    return (
      <div className="ConfigApp">
        Playing: { current }
      </div>
    );
  }
}

export { ConfigApp };
export default connect(state => ({
  current: currentIndex(state),
}), () => ({
}))(ConfigApp);
