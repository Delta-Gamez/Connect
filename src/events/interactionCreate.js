const { info, warn, error, success } = require("../log.js");
const path = require("path");

module.exports = {
    name: "interactionCreate",
    execute: async (interaction) => {
        if (interaction.isAutocomplete()) {
            let command = interaction.client.slashcommands.get(
                interaction.commandName,
            );
            if (!command) {
                command = await searchFile(
                    path.resolve(__dirname, "../../Commands"),
                    `${interaction.commandName}.js`,
                );
                command = require(command)
                if (!command) {
                    error(
                        `No command matching ${interaction.commandName} was found.`,
                    );
                    return;
                }
            }
            try {
                await command.autocomplete(interaction);
            } catch (error) {
                error(error);
            }
            return;
        }
        const client = interaction.client;

        if (interaction.isCommand()) {
            let command = client.commands.get(interaction.commandName);
            if (!command) {
                error(
                    `No command matching ${interaction.commandName} was found.`,
                );
                await interaction.reply({
                    content: `Command ${interaction.commandName} not found.`,
                    ephemeral: true,
                });
                return;
            }
            success(`Interaction Requested: ${interaction.commandName} (Success)`);
            try {
                await command.execute(interaction);
                success(`Executed Command: ${interaction.commandName} (Success)`);
            } catch (e) {
                error(
                    `Error while Executing Command ${interaction.commandName}: ${e}`,
                );
                if (interaction.deferred || interaction.replied) {
                    await interaction.editReply({
                        content:
                            "There was an error running that command. Try again later, or if the error persists, let us know.",
                    });
                } else {
                    await interaction.reply({
                        content:
                            "There was an error running that command. Try again later, or if the error persists, let us know.",
                    });
                }
            }
        } else if (interaction.isButton()) {
            if (interaction.customId.startsWith("x")) {
                return;
            }
            let customid = interaction.customId
            if(interaction.customId.includes("-")) customid = interaction.customId.split("-")[0]
            
            const button = client.buttons.get(customid);
            if (!button) {
                success(`Button Requested: ${interaction.customId} (Not Found)`);
                await interaction.reply({
                    content: `Button ${interaction.customId} not found.`,
                    ephemeral: true,
                });
                return;
            }
            success(`Button Requested: ${interaction.customId} (Success)`);
            try {
                await button.execute(interaction);
                success(`Executed Button: ${interaction.customId} (Success)`);
            } catch (e) {
                error(
                    `Error while Executing Button ${interaction.customId}: ${e}`,
                );
            }
        } else if (interaction.isModalSubmit()) {
            if(interaction.customId.startsWith("x")) return;
            let customid = interaction.customId
            if(interaction.customId.includes("-")) customid = interaction.customId.split("-")[0]
            const modal = client.modals.get(customid);
            if (!modal) {
                success(`Modal Requested: ${interaction.customId} (Not Found)`);
                await interaction.reply({
                    content: `Modal ${interaction.customId} not found.`,
                    ephemeral: true,
                });
                return;
            }
            success(`Modal Requested: ${interaction.customId} (Success)`);
            try {
                await modal.execute(interaction);
                success(`Executed Modal: ${interaction.customId} (Success)`);
            } catch (e) {
                console.error(e);
                error(
                    `Error while Executing Modal ${interaction.customId}: ${e}`,
                );
            }
        }
        return;
    },
};
