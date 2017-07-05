// IPC messaging listeners
const { listen } = require("./ipc");
const ps = require("ps-node");
const { spawn, exec } = require("child_process");
const { dirname, resolve } = require("path");

listen("LIST_PROCESSES", function() {
  return new Promise((resolve, reject) => {
    ps.lookup({}, function(err, list) {
      if (err) {
        reject(err);
        return;
      }
      resolve(list);
    });
  });
});

listen("START_PROCESS", async function(exe) {
  const absolute = resolve(process.cwd(), exe);
  console.log("Starting process", absolute);
  try {
    const child = spawn(absolute, [], {
      detached: true,
      shell: false,
      cwd: dirname(absolute),
    });
    child.on("error", e => console.error(e));
    if (child.pid) {
      return child.pid;
    }
  } catch (e) {
    console.error(e);
    // throw "Could not spawn process";
  }
});

const os = require("os");
listen("KILL_PROCESS", function(pid) {
  console.log("Killing process", pid);
  if(os.platform() === "win32") {
    exec(`taskkill /pid ${pid} /T /F`);
  } else {
    process.kill(pid, 0);
  }
  return true;
});
