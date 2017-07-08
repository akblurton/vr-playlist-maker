 var processWindows = require("node-process-windows");
 
var activeProcesses = processWindows.getProcesses(function(err, processes) {
    processes.filter(p => /ktane/.test(p.processName)).forEach(function (p) {
        console.log(p);
    });
});

