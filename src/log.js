function info(message) {  // Print Information
    console.log(`[INFO] [${new Date().toISOString()}] ${message}`);
}

function warn(message) {  // Print Warning
    console.log(`[WARN] [${new Date().toISOString()}] ${message}`);
}

function error(message) {  // Print Error
    console.log(`[ERROR] [${new Date().toISOString()}] ${message}`);
}

function nolog(message) {  // Print message, but don't log it.
    console.log(`[HIDDEN] [${new Date().toISOString()}] ${message}`);
}

module.exports = { info, warn, error, nolog };