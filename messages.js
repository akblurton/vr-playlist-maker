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
