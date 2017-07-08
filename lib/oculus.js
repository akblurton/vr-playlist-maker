require("babel-register");

const Registry = require("winreg");
const { promisify } = require("util");
const fs = require("fs");
const readDir = promisify(fs.readdir);
const loadFile = promisify(fs.readFile);
const path = require("path");
const discoid = require("discoid/src");



async function getApplicationPaths() {
  const volumes = await discoid.list();
  console.log(volumes);
  const reg = new Registry({
    hive: Registry.HKCU,
    key: "\\Software\\Oculus VR, LLC\\Oculus\\Libraries",
  });

  const results = await promisify(reg.keys.bind(reg))();
  const libraries = [];
  for (const lib of results) {
    try {
      const path = (await promisify(lib.get.bind(lib))("Path")).value;
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
      apps.push({
        id: man.appId,
        installDir: path.resolve(softwareDir, man.canonicalName),
        exe: path.resolve(softwareDir, man.canonicalName, man.launchFile),
        args: man.launchParameters ? man.launchParameters.split(" ") : [],
      });
    }
  }
  return apps;
}

const { spawn } = require("child_process");
(async function() {
  const apps = await getInstalledApps();
  console.log(apps[0].exe);
  spawn(apps[0].exe, apps[0].args, {
    detached: true,
    shell: false,
    cwd: path.dirname(apps[0].exe),
  });
})();