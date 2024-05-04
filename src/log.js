function info(message) {  // Print Information
    log(`[INFO]`,`[${new Date().toISOString()}] ${message}`);
}

function warn(message) {  // Print Warning
    log(`[WARN]`,`[${new Date().toISOString()}] ${message}`);
}

function error(message) {  // Print Error
    log(`[ERROR]`,`[${new Date().toISOString()}] ${message}`);
}

function nolog(message) {  // Print message, but don't log it.
    log(`[HIDDEN]`,`[${new Date().toISOString()}] ${message}`);
}

function log(type, message) {  // Sends Log, Warn, Error, or Nolog to Discord
    const { logswebhook } = require('../config.json');
    console.log(`${type} ${message}`)

    sendwebhook(logswebhook, `${message}`, `Logger: ${type}`);
    
    sendwebhook(logswebhook, `-`, `Logger: ${type}`);
}

function sendwebhook(url, message, username) {
    let payload = {
        content: `${message}`,
        username: `${username}`,
    };
    
    fetch(url, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

}

module.exports = { info, warn, error, nolog };