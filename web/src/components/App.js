import React from "react";
import { autobind } from "core-decorators";
import { send } from "helpers/ipc";

import "styles/components/App.styl";

class App extends React.Component {
  state = {
    processes: [],
  };

  @autobind
  async handleIPC() {
    const t1 = Date.now();
    const response = await send("LIST_PROCESSES");
    const t2 = Date.now();
    this.setState({
      processes: response,
    });
    console.log("Got response (", response, `after ${t2 - t1} milliseconds`);
  }


  render() {
    const { processes } = this.state;
    return (
      <div className="App" onClick={this.handleIPC}>
        {processes.map((p, index) => (
          <pre key={index}>{JSON.stringify(p, null, 2)}</pre>
        ))}
      </div>
    );
  }
}

export default App;
