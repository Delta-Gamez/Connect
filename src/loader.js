const { Client, Collection, Routes } = require('discord.js');
const fs = require('fs');
const { info, warn, error, nolog } = require('./log.js');

/**
 * @param {Client} client
 */
// Function to load all modules
function load(client) {
    // Initialize collections for commands, buttons, and modals
    client.commands = new Collection();
    client.buttons = new Collection();
    client.modals = new Collection();

    // Read all module directories
    const modules = fs.readdirSync('modules');

    // Iterate over each module
    for (const module of modules) {
        try {
            // Import the main file of the module
            const moduleExport = require(`../modules/${module}/index.js`);

            // If the module has commands, load them
            try {
                if (moduleExport.commands !== undefined) {
                    for (const command of moduleExport.commands) {
                        const commandExport = require(`../modules/${module}/${command}`);
                        client.commands.set(commandExport.name, commandExport);
                    }
                }
            } catch (e) {
                // Log any errors that occur while loading commands
                error(`Error while loading module ${module}.commands: ${e}`);
            }

            // If the module has buttons, load them
            try {
                if (moduleExport.buttons !== undefined) {
                    for (const button of moduleExport.buttons) {
                        const buttonExport = require(`../modules/${module}/${button}`);
                        client.buttons.set(buttonExport.customId, buttonExport);
                    }
                }
            } catch (e) {
                // Log any errors that occur while loading buttons
                error(`Error while loading module ${module}.buttons: ${e}`);
            }

            // If the module has modals, load them
            try {
                if (moduleExport.modals !== undefined) {
                    for (const modal of moduleExport.modals) {
                        const modalExport = require(`../modules/${module}/${modal}`);
                        client.modals.set(modalExport.customId, modalExport);
                    }
                }
            } catch (e) {
                // Log any errors that occur while loading modals
                error(`Error while loading module ${module}.modals: ${e}`);
            }
        } catch (e) {
            // Log any errors that occur while loading the module
            error(`Error while loading module ${module}: ${e}`);
        }
    }

    // Log the number of commands, buttons, and modals that were loaded
    info(`Loaded ${client.commands.size} commands, ${client.buttons.size} buttons, ${client.modals.size} modals`);
}

/**
 * @param {Client} client
 */
// Function to register all commands
async function register(client) {
    try {
        // First, clear all existing application commands
        const _ = await client.rest.put(
            Routes.applicationCommands(client.user.id),
            { body: [] }, // Empty array to clear commands
        );

        // Then, register all commands stored in the client.commands collection
        const data = await client.rest.put(
            Routes.applicationCommands(client.user.id),
            { body: client.commands }, // client.commands contains all commands to register
        );

        // Log the number of successfully registered commands
        info(`Successfully registered ${data.length} application commands.`);
    } catch (e) {
        // Log any errors that occur while registering commands
        error(`Error while registering commands: ${e}`);
    }
}

module.exports = {
    load, register
};
