const { getInstalledApps, getAppDetails, launchApp } = require("./lib/steam");

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
    // console.log(JSON.stringify(details, null, 2));
    console.log(details[2]);
    const kill = await launchApp(details[2]);
    await new Promise(resolve => setTimeout(resolve, 5000));
    const response = await kill();
    console.log(response);

  } catch (e) {
    console.error("my dewtails!");
    console.error(e);
  }
}
doIt();

//
//  wmic Path win32_process Where "CommandLine Like '%legendofdungeon.exe%'" get ProcessId,name,commandline /format:list