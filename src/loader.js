const { Client, Collection, Routes } = require('discord.js');
const fs = require('fs');
const { info, warn, error, nolog } = require('./log.js');
const { REST } = require('@discordjs/rest');

/**
 * @param {Client} client
 */
// Function to load all modules
function load(client) {
    // Initialize collections for commands, buttons, and modals
    client.commands = new Collection();
    client.buttons = new Collection();
    client.modals = new Collection();

    // Read all commands
    const commandFiles = fs.readdirSync(`./Commands`);

    for (const file of commandFiles) {
        const filePath = `../Commands/${file}`;
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
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
    info(`Loaded ${client.commands.size} commands, ${client.buttons.size} buttons, ${client.modals.size} modals`);
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
        const commands = client.commands.map(command => command.data.toJSON());

        // Use the REST API to register commands
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
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
