const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const url = require("url");

const { getApplicationPaths: getOculusPaths } = require("./lib/oculus");
const { getApplicationPaths: getSteamPaths } = require("./lib/steam");

require("electron-debug")({
  showDevTools: false,
});

require("./messages");

let mainWin = null, configWin = null, editorWin = null;
const WINDOW_FRAME_WIDTH = 300;
const WINDOW_FRAME_HEIGHT = 500;
const CONFIG_WINDOW_FRAME_WIDTH = 300;
const CONFIG_WINDOW_FRAME_HEIGHT = 500;
const WEB_ASSETS_DIR = path.join(__dirname, "web");

const asset = file => path.join(WEB_ASSETS_DIR, file);

function installExtensions() {
  const installer = require("electron-devtools-installer");
  const force = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [
    "REACT_DEVELOPER_TOOLS",
    "REDUX_DEVTOOLS",
  ];


  return Promise.all(
    extensions.map(name => installer.default(installer[name], force))
  ).catch(console.log);
}


async function createWindow() {
  try {
    if (process.env.NODE_ENV === "development") {
      await installExtensions();
    }

    // Get Steam and Oculus paths
    const steamPaths = await getSteamPaths();
    const oculusPaths = await getOculusPaths();

    console.log("Steam Paths", steamPaths);
    console.log("Oculus Paths", oculusPaths);

    // Create the browser window.
    mainWin = new BrowserWindow({
      show: false,
      width: WINDOW_FRAME_WIDTH,
      height: WINDOW_FRAME_HEIGHT,
      resizable: false,
      maximizable: false,
      fullscreen: false,
      fullscreenable: false,
      title: "VR Playlist Maker",
      frame: false,
    });

    configWin = new BrowserWindow({
      parent: mainWin,
      show: false,
      width: CONFIG_WINDOW_FRAME_WIDTH,
      height: CONFIG_WINDOW_FRAME_HEIGHT,
      resizable: false,
      maximizable: false,
      fullscreen: false,
      fullscreenable: false,
      title: "Options",
      frame: false,
    });

    editorWin = new BrowserWindow({
      parent: mainWin,
      show: false,
      width: CONFIG_WINDOW_FRAME_WIDTH + 120,
      height: CONFIG_WINDOW_FRAME_HEIGHT,
      resizable: false,
      maximizable: false,
      fullscreen: false,
      fullscreenable: false,
      title: "Playlist Editor",
      frame: false,
    });

    mainWin.once("ready-to-show", () => mainWin.show());

    ipcMain.on("SHOW_CONFIG_WINDOW", function() {
      configWin.show();
    });
    ipcMain.on("SHOW_EDITOR_WINDOW", function() {
      editorWin.show();
    });

    // and load the index.html of the app.
    mainWin.loadURL(url.format({
      pathname: asset("index.html"),
      protocol: "file:",
      slashes: true,
    }));

    configWin.loadURL(url.format({
      pathname: asset("config.html"),
      protocol: "file:",
      slashes: true,
    }));

    editorWin.loadURL(url.format({
      pathname: asset("editor.html"),
      protocol: "file:",
      slashes: true,
    }));

    configWin.on("close", function(e) {
      e.preventDefault();
      configWin.hide();
      return false;
    });
    editorWin.on("close", function(e) {
      e.preventDefault();
      editorWin.hide();
      return false;
    });

    // Emitted when the window is closed.
    mainWin.on("closed", () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWin = null;
    });
  } catch (e) {
    console.error(e);
  }
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {
  app.quit();
});

