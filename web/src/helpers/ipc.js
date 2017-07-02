import { ipcRenderer } from "electron";
import uuid from "uuid/v4";

class IPCTimeoutError {}

function send(channel, args = [], timeout = 10000) {
  return new Promise((resolve, reject) => {
    const id = uuid();
    const rejector = setTimeout(function() {
      cleanup();
      reject(new IPCTimeoutError());
    }, timeout);
    const errorHandler = function(event, uid, error) {
      if (uid !== id) {
        return;
      }
      cleanup();
      reject(error);
    };
    const handler = function(event, uid, response) {
      if (uid !== id) {
        return;
      }
      cleanup();
      resolve(response);
    };
    const cleanup = function() {
      clearTimeout(rejector);
      ipcRenderer.removeListener(`${channel}_REPLY`, handler);
      ipcRenderer.removeListener(`${channel}_ERROR`, errorHandler);
    };
    ipcRenderer.on(`${channel}_REPLY`, handler);
    ipcRenderer.on(`${channel}_ERROR`, errorHandler);
    ipcRenderer.send(channel, id, ...args);
  });
}

export { IPCTimeoutError, send };
