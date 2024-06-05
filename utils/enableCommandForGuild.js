
const { error } = require("../src/log.js");
const { Collection, Routes } = require("discord.js");
const { rest } = require("../src/loader.js");

/*
    * @param required {CommandInteraction} interaction The interaction object
    * @param required {commandName} The name of the command to be enabled
    * @returns {Promise} A promise that resolves with the selected channel
*/

async function enableCommandForGuild(interaction, commandname){
    try {
        let commands = new Collection();

        // Load your command data, e.g., from a file
        const command = require(`../Commands/${commandname}.js`);
    
        // Add the command to the collection
        commands.set(command.data.name, command);
    
        // Convert the command data to JSON format required by Discord API
        const commandData = commands.map(command => command.data.toJSON());
    
        // Use PATCH to add the command to the guild
        await rest.put(
            Routes.applicationGuildCommands(interaction.client.user.id, interaction.guild.id),
            { body: commandData }
        );

        return true
    } catch (error){
        error(error)
        return false
    }
}

module.exports = enableCommandForGuild;