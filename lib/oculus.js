const Registry = require("winreg");
const promisify = require("util.promisify");
const fs = require("fs-extra");
const readDir = promisify(fs.readdir);
const loadFile = promisify(fs.readFile);
const copyFile = promisify(fs.copy);
const path = require("path");
const discoid = require("./discoid");
const sqlite3 = require('sqlite3').verbose();

const oculusDatabasePath = path.resolve(
  process.env.APPDATA, "Oculus\\sessions\\_oaf\\data.sqlite"
);

async function getApplicationPaths() {
  if (process.platform !== "win32") {
    return [
      "C:\\Program Files\\Oculus\\",
    ];
  }
  const volumes = await discoid.list();
  const reg = new Registry({
    hive: Registry.HKCU,
    key: "\\Software\\Oculus VR, LLC\\Oculus\\Libraries",
  });

  const results = await promisify(reg.keys.bind(reg))();
  const libraries = [];
  for (const lib of results) {
    try {
      let path = (await promisify(lib.get.bind(lib))("Path")).value;
      // Oculus returns paths using volume identifiers, transform to letter
      // mounts so that spawn will work later
      const volume = volumes.find(v => path.indexOf(v.unc) === 0);
      if (volume) {
        path = path.replace(volume.unc, `${volume.letter}:\\\\`);
      }
      libraries.push(path);
    } catch (e) {
      // ignore and skip
      console.log(e);
    }
  }
  return libraries;
}
module.exports.getApplicationPaths = getApplicationPaths;

async function getAllAppNames() {
  // Oculus locks the sqlite file, copy it
  const target = path.resolve(__dirname, "oculusdb.sqlite");
  await copyFile(oculusDatabasePath, target);
  return await new Promise((resolve, reject) => {
    const db = new sqlite3.Database(
      target,
      sqlite3.OPEN_READONLY,
      function(err) {
        if (err) {
          reject(err);
          return;
        }
        db.configure("busyTimeout", 10000);
        console.log("Opened database", oculusDatabasePath); 
        const appNames = {};
        db.each(
          `SELECT 
            hashkey, value
            FROM
            Objects
            WHERE typename = 'Application'            
          `,
          function(err, row) {
            if (err) {
              console.log("error", err);
              reject(err);
              return false;
            }
            // Cheeky way of grabbing the data based on a known binary match
            // once the actual data structure can be determine, switch this
            // out
            const displayIndex = row.value.indexOf(new Buffer([
              0x64,
              0x69,
              0x73,
              0x70,
              0x6c,
              0x61,
              0x79,
              0x5f,
              0x6e,
              0x61,
              0x6d,
              0x65,
            ]));
            if (displayIndex === -1) {
              return;
            }
            const b = row.value.slice(displayIndex+12);
            const endRemoved = b.slice(0, b.indexOf(new Buffer([0x72, 0x08, 00, 00])));
            const name = endRemoved.slice(endRemoved.lastIndexOf(0)+1);
            appNames[row.hashkey] = name.toString("utf-8");
        }, (err) => {
          console.log(err);
          resolve(appNames)
          db.close(() => fs.unlink(target));
        });
      }
    )
  });
}
module.exports.getAllAppNames = getAllAppNames;

async function getInstalledApps() {
  if (process.platform !== "win32") {
    return require("./oculus.json");
  }
  const names = await getAllAppNames();
  console.log(names);
  const paths = await getApplicationPaths();
  const apps = [];
  for (const dir of paths) {
    const manifestDir = path.resolve(dir, "Manifests");
    const softwareDir = path.resolve(dir, "Software");
    const files = await readDir(manifestDir);
    for (const f of files) {
      if (!/\.json\.mini/.test(f)) {
        continue;
      }
      const contents = await loadFile(path.resolve(manifestDir, f), "utf-8");
      const man = JSON.parse(contents);
      const name = man.canonicalName;
      apps.push({
        id: man.appId,
        title: names[man.appId],
        installDir: path.resolve(softwareDir, name),
        exe: path.resolve(softwareDir, name, man.launchFile),
        icon: path.resolve(
          softwareDir,
          "StoreAssets",
          `${name}_assets`,
          "icon_image.jpg"
        ),
        args: man.launchParameters ? man.launchParameters.split(" ") : [],
      });
    }
  }
  return apps;
}
module.exports.getInstalledApps = getInstalledApps;
