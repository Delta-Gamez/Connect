const { EmbedBuilder } = require("discord.js");

function info(message) {
    // Print Information
    log(`\x1b[0m[INFO]`, `${message}`, `#00703c`);
}

function warn(message) {
    // Print Warning
    log(`\x1b[0;33m[WARN]`, `${message}`, `#ffdd00`);
}

function error(message) {
    // Print Error
    log(`\x1b[0;1;31m[ERROR]`, `${message}`, `#d4351c`);
}

function nolog(message) {
    // Print message, but don't log it.
    log(`[HIDDEN]`, `${message}`, `#b1b4b6`);
}

function custom(type, message, color) {
    let _color = color ?? `#b1b4b6`;
    log(`${type}`, `${message}`, _color);
}

function log(type, message, color) {
    // Sends Log, Warn, Error, or Nolog to Discord
    const { logswebhook } = require("../config.json");
    console.log(`${type} ${new Date().toISOString()}] ${message}`);

    sendwebhook(logswebhook, `${message}`, `${type}`, color);
}

function sendwebhook(url, message, username, color) {
    let embed
    if (message.length > 255) {
        embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(username)
            .setTimestamp()
            .setDescription(message);
    } else {
        embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(message)
            .setTimestamp();
    }

    let payload = {
        embeds: [embed],
        username: `Logger: ${username}`,
    };

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
}

module.exports = { info, warn, error, nolog, custom };
