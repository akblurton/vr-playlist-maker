import React from "react";


import { send } from "helpers/ipc";

async function testIpc() {
  const t1 = Date.now();
  const response = await send("TEST_IPC", ["hello world"]);
  const t2 = Date.now();
  console.log(`Got response (${response}) after ${t2 - t1} milliseconds`);
}

class App extends React.Component {
  render() {
    return (
      <div className="App" onClick={testIpc}>
        Hello
      </div>
    );
  }
}

export default App;
