const Registry = require("winreg");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const { parse } = require("vdf");
const readFile = promisify(fs.readFile);
const readDir = promisify(fs.readdir);
const { exec, spawn } = require("child_process");
var child = require('child-process-promise')
const { readAppInfo } = require("binary-vdf");

regKey = new Registry({                                       // new operator is optional 
  hive: Registry.HKCU,                                        // open registry hive HKEY_CURRENT_USER 
  key:  '\\Software\\Valve\\Steam' // key containing autostart programs 
});

const getSteamPath = () => new Promise((resolve, reject) => {
  regKey.values(function (err, items /* array of RegistryItem */) {
    if (err) {
      reject(err);
    }

    const path = items.find(item => item.name === "SteamPath");
    if (!path) {
      reject(0);
    }

    const exe = items.find(item => item.name === "SteamExe");
    if (!exe) {
      reject(-1);
    }

    resolve([path.value, exe.value]);
  });
});


async function tryIt() {
  const [steamDir, steamExe] = await getSteamPath();
  const steamapps = path.resolve(steamDir, "steamapps");

  // Get VDF spec for any additional directories
  const libraryVDF = await readFile(path.resolve(steamapps, "libraryfolders.vdf"), "utf-8");
  const libraryManifest = parse(libraryVDF).LibraryFolders;
  const libraryFolders = [
    steamapps,
    ...Object.entries(libraryManifest).filter(([key]) => /^\d+$/.test(key)).reduce((arr, [, dir]) => (
      [...arr, path.resolve(dir, "steamapps")]
    ), [])
  ];

  const apps = {};
  for (const dir of libraryFolders) {
    const files = await readDir(dir);
    for (const f of files) {
      if (!/^appmanifest_\d+\.acf$/.test(f)) {
        continue;
      }

      const manifestVDF = await readFile(path.resolve(dir, f), "utf-8");
      const manifest = parse(manifestVDF).AppState;
      apps[manifest.appid] = manifest.name;
    }
  }

  const id =  Object.keys(apps)[0];
  console.log(steamExe + " steam://run/" + id);
  // exec(steamExe + " steam://run/" + id)
  console.log(Object.keys(apps));

  const appInfo = fs.createReadStream(path.resolve(steamDir, "appcache/appinfo.vdf"));
  const appInfoJSON = (await readAppInfo(appInfo)).filter(e => (
      Object.keys(apps).includes(e.entries.appid.toString()
    ))
  );

  fs.writeFileSync("appinfo.json", JSON.stringify(appInfoJSON, null, 2));
  console.log(appInfoJSON);

}

tryIt();
