const { getInstalledApps, getAppDetails } = require("./lib/steam");

async function doIt() {
  let apps;
  try {
    apps = await getInstalledApps();
  } catch (e) {
    console.error("My apps!!!!");
    console.error(e);
    return;
  }
  try {
    const details = await getAppDetails(apps);
    console.log(JSON.stringify(details, null, 2));
  } catch (e) {
    console.error("my details!");
    console.error(e);
  }
}
doIt();
