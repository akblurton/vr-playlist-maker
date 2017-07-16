const { getAllAppNames } =  require("./lib/oculus");

(async function() {
  const names = await getAllAppNames();
  console.log(names);
})();