/*
 * Determine user's steam library folders, and relevant information
 */

const Registry = require("winreg");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const { parse } = require("vdf");
const readFile = promisify(fs.readFile);
const readDir = promisify(fs.readdir);
const { readAppInfo } = require("binary-vdf");
const { get } = require("object-path");
const { execFile } = require("child_process");
const escapeStringRegexp = require("escape-string-regexp");


class SteamPlatformNotSupported {}
class SteamDataMissing {}
class SteamVDFError {}
class SteamAppNotFound {}

module.exports.SteamPlatformNotSupported = SteamPlatformNotSupported;
module.exports.SteamDataMissing = SteamDataMissing;
module.exports.SteamVDFError = SteamVDFError;
module.exports.SteamAppNotFound = SteamAppNotFound;

// Cache paths to prevent hitting the registry all the time
let _cachedPaths = null;
async function getApplicationPaths() {
  if (_cachedPaths) {
    return _cachedPaths;
  }
  if (process.platform !== "win32") {
    if (process.env.MOCK_STEAM === "yes") {
      // Send fake data
      return {
        installDir: "C:\\Program Files\\Steam",
        exe: "C:\\Program Files\\Steam\\steam.exe",
      };
    } else {
      throw new SteamPlatformNotSupported();
    }
  }

  // Grab steam data from Windows registry
  const reg = new Registry({
    hive: Registry.HKCU,
    key: "\\Software\\Valve\\Steam",
  });

  const keys = await new Promise((resolve, reject) => {
    reg.values((err, items) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(items);
    });
  });

  const installDir = keys.find(({ name }) => name === "SteamPath");
  const exe = keys.find(({ name }) => name === "SteamExe");

  if (!installDir || !exe) {
    throw new SteamDataMissing();
  }

  _cachedPaths = {
    installDir: installDir.value,
    exe: exe.value,
  };
  return _cachedPaths;
}
module.exports.getApplicationPaths = getApplicationPaths;

async function getLibraryPaths() {
  if (process.platform !== "win32") {
    if (process.env.MOCK_STEAM === "yes") {
      // Send fake data
      return [
        "C:\\Program Files\\Steam\\steamapps",
      ];
    } else {
      throw new SteamPlatformNotSupported();
    }
  }

  const { installDir } = await getApplicationPaths();
  // There is always a root library containing further library references
  // in the install directory
  const rootLibrary = path.resolve(installDir, "steamapps");

  let libraryList;
  try {
    libraryList = parse(
      await readFile(path.resolve(rootLibrary, "libraryfolders.vdf"), "utf-8")
    ).LibraryFolders;
  } catch (e) {
    throw new SteamVDFError();
  }

  return [
    rootLibrary,
    // Library listing contains some extra data we don't need
    // all actual directories are in numerical keys
    ...Object.entries(libraryList).filter(([key]) => (
      /^\d+$/.test(key)
    )).reduce((arr, [, dir]) => (
      [...arr, path.resolve(dir, "steamapps")]
    ), []),
  ];
}
module.exports.getLibraryPaths = getLibraryPaths;

module.exports.getInstalledApps = async function getInstalledApps(paths) {
  if (process.platform !== "win32") {
    if (process.env.MOCK_STEAM === "yes") {
      // Send fake data
      return [
        {
          id: 450390,
          name: "The Lab",
          library: "C:\\Program Files\\Steam\\steamapps",
        },
      ];
    } else {
      throw new SteamPlatformNotSupported();
    }
  }

  if (paths === void 0) {
    paths = await getLibraryPaths();
  }

  let manifests = [];
  for (const library of paths) {
    const files = await readDir(library);
    manifests = [
      ...manifests,
      ...files.filter(
        f => /^appmanifest_\d+\.acf$/.test(f)
      ).map(f => (
        [library, path.resolve(library, f)]
      )),
    ];
  }

  return await Promise.all(manifests.map(async function([library, manifest]) {
    const { appid: id, name } = parse(await readFile(manifest, "utf-8")).AppState;
    return {
      id,
      name,
      library,
    };
  }));
};

// Cache appinfo.vdf by default as it is quite large
let _appinfo = null;
async function getAppDetails(app, force) {
  const { installDir } = await getApplicationPaths();
  if (app instanceof Array) {
    return await Promise.all(app.map(a => getAppDetails(a, force)));
  }

  const appId = parseInt(app.id, 10); // Ensure we're working with an integer
  const library = app.library;

  if (process.platform !== "win32") {
    if (process.env.MOCK_STEAM === "yes") {
      // Send fake data
      _appinfo = require("./appinfo.json");
    } else {
      throw new SteamPlatformNotSupported();
    }
  } else if (!_appinfo || force === true) {
    _appinfo = await readAppInfo(
      fs.createReadStream(path.resolve(installDir, "appcache/appinfo.vdf"))
    );
  }

  const entry = _appinfo.find(({ id }) => id === appId);
  if (!entry) {
    throw new SteamAppNotFound();
  }

  const icon = get(entry, "entries.common.clienticon");
  const isVR = get(entry, "entries.common.openvrsupport", 0);
  const installedAt = get(entry, "entries.config.installdir");
  const launchers = Object.values(get(entry, "entries.config.launch"));

  const target = process.platform === "win32" ? "windows" : null;
  let launcher = launchers.find(l => (
    get(l, "config.oslist") === target
  ));
  if (!launcher) {
    launcher = launchers.find(l => l.type === "default");
  }
  if (!launcher) {
    launcher = launchers[0];
  }

  const { executable, workingdir } = launcher;
  return Object.assign({}, app, {
    icon: icon ? path.resolve(installDir, "steam/games", `${icon}.ico`) : null,
    isVR: !!isVR,
    exe: path.resolve(library, installedAt, executable),
    dir: path.resolve(library, installedAt, (
      workingdir ? workingdir : path.dirname(executable)
    )),
  });
}
module.exports.getAppDetails = getAppDetails;

// Requires adminstrator permissions to execute due to subsequent process
// being owned by Steam
module.exports.launchApp = async function(app) {
  const { id, exe } = app;
  const { exe: steam } = await getApplicationPaths();

  execFile(steam, [`steam://launch/${id}`], {
    detached: true,
    shell: false,
  });
  return async function() {
    await require("taskkill")(path.basename(exe), {
      force: true,
    });
  }    
}