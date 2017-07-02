export function time(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  return [
    hours.toString().padStart(2, "0"),
    (minutes % 60).toString().padStart(2, "0"),
    (seconds % 60).toString().padStart(2, "0"),
  ].join(":");
}

const path = require("path");
export function executable(exe) {
  return path.basename(exe);
}
