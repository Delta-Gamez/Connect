const { EmbedBuilder } = require("discord.js");
const { embedLog } = require("./../embeds.js");

function info(message) {
    // Print Information
    log(embedLog.Info.title, `${message}`,embedLog.Info.color);
}

function warn(message) {
    // Print Warning
    log(embedLog.Warn.title, `${message}`, embedLog.Warn.color);
}

function error(message) {
    // Print Error
    log(embedLog.Error.title, `${message}`, embedLog.Error.color);
}

function success(message) {
    // Print Success
    log(embedLog.Success.title, `${message}`, embedLog.Success.color);
}

function custom(type, message, color, embed) {
    let _color = color ?? `#b1b4b6`;
    log(`${type}`, `${message}`, _color, embed);
}

function log(type, message, color, embed) {
    // Sends Log, Warn, Error, or Nolog to Discord
    const { logswebhook } = require("../config.json");
    console.log(`${type} ${new Date().toISOString()}] ${message}`);

    sendwebhook(logswebhook, `${message}`, `${type}`, color, embed);
}

function sendwebhook(url, message, username, color, embed) {
    embed = embed ?? null;
    if(!embed){
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

module.exports = { info, warn, error, success, custom };
