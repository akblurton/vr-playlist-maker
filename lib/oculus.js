const Registry = require("winreg");
const { promisify } = require("util");
const fs = require("fs");
const readDir = promisify(fs.readdir);
const loadFile = promisify(fs.readFile);
const path = require("path");
const discoid = require("./discoid");



async function getApplicationPaths() {
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
};
module.exports.getApplicationPaths = getApplicationPaths;

async function getInstalledApps() {
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
        installDir: path.resolve(softwareDir, name),
        exe: path.resolve(softwareDir, name, man.launchFile),
        icon: path.resolve(softwareDir, "StoreAssets", name + "_assets", "cover_landscape_image.jpg"),
        args: man.launchParameters ? man.launchParameters.split(" ") : [],
      });
    }
  }
  return apps;
}

const { spawn } = require("child_process");
(async function() {
  const apps = await getInstalledApps();
  console.log(apps);
  // spawn(apps[0].exe, apps[0].args, {
  //   detached: true,
  //   shell: false,
  //   cwd: path.dirname(apps[0].exe),
  // });
  fs.writeFileSync(path.join(__dirname, "oculus.json"), JSON.stringify(apps, null, 2));
})();