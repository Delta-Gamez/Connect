
const { error, info } = require("../src/log.js");
const { Routes } = require("discord.js");
const { rest } = require("../src/loader.js");

/*
    * @param required {CommandInteraction} interaction The interaction object
    * @param required {commandName} The name of the command to be enabled
    * @returns {Promise} A promise that resolves with the selected channel
*/

async function disableCommandForGuild(interaction, commandname){
    try {
        const commands = await rest.get(
            Routes.applicationGuildCommands(interaction.client.user.id, interaction.guild.id)
        );
        
        // Find the command by name
        const command = commands.find(cmd => cmd.name === commandname);
        
        // Check if the command exists
        if (!command) {
            info(`Command with name "${commandname}" not found.`);
            return;
        }
        
        // Delete the command by ID
        await rest.delete(
            Routes.applicationGuildCommand(interaction.client.user.id, interaction.guild.id, command.id)
        );

        return true
    } catch (error){
        error(error)
        return false
    }
}

module.exports = disableCommandForGuild;