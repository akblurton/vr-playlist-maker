import { ipcRenderer } from "electron";
import uuid from "uuid/v4";

class IPCTimeoutError {}

function send(channel, args = [], timeout = 10000) {
  return new Promise((resolve, reject) => {
    const id = uuid();
    const rejector = setTimeout(function() {
      reject(new IPCTimeoutError());
      ipcRenderer.removeListener(`${channel}_REPLY`, handler);
    }, timeout);
    const handler = function(event, uid, response) {
      if (uid !== id) {
        return;
      }
      clearTimeout(rejector);
      resolve(response);
      ipcRenderer.removeListener(`${channel}_REPLY`, handler);
    };
    ipcRenderer.on(`${channel}_REPLY`, handler);
    ipcRenderer.send(channel, id, ...args);
  });
}

export { IPCTimeoutError, send };
