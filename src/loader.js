const { Client, Collection, Routes } = require('discord.js');
const fs = require('fs');
const { info, warn, error, nolog } = require('./log.js');
const { REST } = require('@discordjs/rest');
const { betacommands, betaserver } = require('../config.json');

/**
 * @param {Client} client
 */
// Function to load all modules
function load(client) {
    // Initialize collections for commands, buttons, and modals
    client.commands = new Collection();
    client.globalcommands = new Collection();
    client.betacommands = new Collection();
    client.buttons = new Collection();
    client.modals = new Collection();

    // Read all commands
    const commandFiles = fs.readdirSync(`./Commands`);

    for (const file of commandFiles) {
        if(betacommands.includes(file)) {
            const filePath = `../Commands/${file}`;
            const command = require(filePath);
            // Set a new item in the Collection with the key as the command name and the value as the exported module
            if ('data' in command && 'execute' in command) {
                client.betacommands.set(command.data.name, command);
                client.commands.set(command.data.name, command);
            } else {
                warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
            }           
        } else {
            const filePath = `../Commands/${file}`;
            const command = require(filePath);
            // Set a new item in the Collection with the key as the command name and the value as the exported module
            if ('data' in command && 'execute' in command) {
                client.globalcommands.set(command.data.name, command);
                client.commands.set(command.data.name, command);
            } else {
                warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }


    }

    // Read all Modals
    const ModalFiles = fs.readdirSync(`./Modals`);

    for (const file of ModalFiles) {
        const filePath = `../Modals/${file}`;
        const Modal = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in Modal && 'execute' in Modal) {
            client.modals.set(Modal.data.customId, Modal);
        } else {
            warn(`The Modal at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }

    // Log the number of commands, buttons, and modals that were loaded
    info(`Loaded ${client.globalcommands.size} commands, ${client.buttons.size} buttons, ${client.modals.size} modals, ${client.betacommands.size} beta commands.`);
}

/**
 * @param {Client} client
 */
// Function to register all commands
async function register(client) {
    const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

    try {
        info(`Started refreshing ${client.commands.size} application (/) commands.`);
        
        // Create an array of commands
        const commands = client.globalcommands.map(command => command.data.toJSON());

        // Use the REST API to register commands
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        );

        // Create an array of commands
        const betacommandse = client.betacommands.map(command => command.data.toJSON());

        // Use the REST API to register commands
        await rest.put(
            Routes.applicationGuildCommands(client.user.id, betaserver),
            { body: betacommandse }
        );

        info(`Successfully reloaded ${client.commands.size} application (/) commands.`);
    } catch (error) {
        error("Received an error while refreshing commands.");
        error(error);
    }
}


module.exports = {
    load, register
};
