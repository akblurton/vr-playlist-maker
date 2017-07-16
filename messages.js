// IPC messaging listeners
const { listen } = require("./ipc");
const ps = require("ps-node");
const { spawn, exec } = require("child_process");
const { dirname, resolve } = require("path");
const oculus = require("./lib/oculus");
const steam = require("./lib/steam");
const uuid = require("uuid/v4");
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


(async function() {
  // Get Steam and Oculus paths
  const steamPaths = await steam.getApplicationPaths();
  const steamLibrary = await steam.getLibraryPaths();
  const oculusLibrary = await oculus.getApplicationPaths();

  console.log("Steam Paths", steamPaths);
  console.log("Steam Libraries", steamLibrary);
  console.log("Oculus Libraries", oculusLibrary);

  listen("GET_OCULUS_LIBRARY", async function() {
    return await oculus.getInstalledApps();
  });

  listen("GET_STEAM_LIBRARY", async function() {
    const apps = await steam.getInstalledApps();
    return await steam.getAppDetails(apps);
  });

  const steamProcesses = {};
  listen("START_STEAM_PROCESS", async function(app) {
    const killIt = await steam.launchApp(app, true);
    const uid = uuid();
    steamProcesses[uid] = killIt;
    return uid;
  })

  listen("KILL_STEAM_PROCESS", async function(uid) {
    if (uid in steamProcesses) {
      try {
        await steamProcesses[uid]();
      } catch (e) {
        console.log("Could not kill process", e);
      }
    }
    console.error("Could not find steam process");
  });


})();
