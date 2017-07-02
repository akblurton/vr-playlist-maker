// IPC messaging listeners
const { listen } = require("./ipc");
const ps = require("ps-node");

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

listen("START_PROCESS", function(exe) {
  console.log("Starting process", exe);
  return true;
});

listen("KILL_PROCESS", function(pid) {
  console.log("Killing process", pid);
  return true;
});
