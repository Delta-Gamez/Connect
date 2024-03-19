function info(message) {  // Print Information
    console.log(`[INFO] ${message}`);
}
function warn(message) {  // Print Warning
    console.log(`[WARN] ${message}`);
}
function error(message) {  // Print Error
    console.log(`[ERROR] ${message}`);
}
function nolog(message) {  // Print message, but don't log it.
    console.log(`[HIDDEN] ${message}`);
}
module.exports = { info, warn, error, nolog }
