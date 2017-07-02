const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");


require("electron-debug")({
  showDevTools: "undocked",
});

require("./messages");

let win = null;
const WINDOW_FRAME_WIDTH = 300;
const WINDOW_FRAME_HEIGHT = 500;
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
  if (process.env.NODE_ENV === "development") {
    await installExtensions();
  }

  // Create the browser window.
  win = new BrowserWindow({
    show: false,
    width: WINDOW_FRAME_WIDTH,
    height: WINDOW_FRAME_HEIGHT,
    resizable: false,
    maximizable: false,
    fullscreen: false,
    fullscreenable: false,
    title: "VR Playlist Maker",
  });

  win.once("ready-to-show", () => win.show());

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

