const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");

require("electron-debug")({
  showDevTools: "undocked",
});

let win = null;
const WINDOW_FRAME_WIDTH = 300;
const WINDOW_FRAME_HEIGHT = 500;
const WEB_ASSETS_DIR = path.join(__dirname, "web");

const asset = file => path.join(WEB_ASSETS_DIR, file);

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: WINDOW_FRAME_WIDTH,
    height: WINDOW_FRAME_HEIGHT,
    resizable: false,
    maximizable: false,
    fullscreen: false,
    fullscreenable: false,
    title: "VR Playlist Maker",
  });

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: asset("index.html"),
    protocol: "file:",
    slashes: true,
  }));

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {
  app.quit();
});

