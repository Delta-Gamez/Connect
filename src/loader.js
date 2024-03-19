const { Client, Collection, Routes } = require('discord.js');
const fs = require('fs');
const { info, warn, error, nolog } = require('./log.js');

/**
 * @param {Client} client
 */
function load(client) {
    client.commands = new Collection();
    client.buttons = new Collection();
    client.modals = new Collection();
    const modules = fs.readdirSync('modules');
    for (const module of modules) {
        try {
            const moduleExport = require(`../modules/${module}/index.js`);
            try {
                if (!(moduleExport.commands == undefined)) {
                    for (const command of moduleExport.commands) {
                        const commandExport = require(`../modules/${module}/${command}`);
                        client.commands.set(commandExport.name, commandExport);
                    }
                }
            } catch (e) {
                error(`Error while loading module ${module}.commands: ${e}`);
            }
            try {
                if (!(moduleExport.buttons == undefined)) {
                    for (const button of moduleExport.buttons) {
                        const buttonExport = require(`../modules/${module}/${button}`);
                        client.buttons.set(buttonExport.customId, buttonExport);
                    }
                }
            } catch (e) {
                error(`Error while loading module ${module}.buttons: ${e}`);
            }
            try {
                if (!(moduleExport.modals == undefined)) {
                    for (const modal of moduleExport.modals) {
                        const modalExport = require(`../modules/${module}/${modal}`);
                        client.modals.set(modalExport.customId, modalExport);
                    }
                }
            } catch (e) {
                error(`Error while loading module ${module}.modals: ${e}`);
            }
        } catch (e) {
            error(`Error while loading module ${module}: ${e}`);
        }
    }
    info(`Loaded ${client.commands.size} commands, ${client.buttons.size} buttons, ${client.modals.size} modals`);
}

/**
 * @param {Client} client
 */
async function register(client) {
    try {
        const _ = await client.rest.put(
            Routes.applicationCommands(client.user.id),
            { body: [] },
        );
        const data = await client.rest.put(
            Routes.applicationCommands(client.user.id),
            { body: client.commands },
        );
        info(`Successfully registered ${data.length} application commands.`);
    } catch (e) {
        error(`Error while registering commands: ${e}`);
    }
}

module.exports = {
    load, register
};
