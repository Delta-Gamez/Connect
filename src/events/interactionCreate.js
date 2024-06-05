const { info, warn, error, nolog } = require("../log.js");
const fs = require("fs");
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
            info(`Interaction Requested: ${interaction.commandName} (Success)`);
            try {
                await command.execute(interaction);
                info(`Executed Command: ${interaction.commandName} (Success)`);
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
            const button = client.buttons.get(interaction.customId);
            if (!button) {
                info(`Button Requested: ${interaction.customId} (Not Found)`);
                await interaction.reply({
                    content: `Button ${interaction.customId} not found.`,
                    ephemeral: true,
                });
                return;
            }
            info(`Button Requested: ${interaction.customId} (Success)`);
            try {
                await button.execute(interaction);
                info(`Executed Button: ${interaction.customId} (Success)`);
            } catch (e) {
                error(
                    `Error while Executing Button ${interaction.customId}: ${e}`,
                );
            }
        } else if (interaction.isModalSubmit()) {
            const modal = client.modals.get(interaction.customId);
            if (!modal) {
                info(`Modal Requested: ${interaction.customId} (Not Found)`);
                await interaction.reply({
                    content: `Modal ${interaction.customId} not found.`,
                    ephemeral: true,
                });
                return;
            }
            info(`Modal Requested: ${interaction.customId} (Success)`);
            try {
                await modal.execute(interaction);
                info(`Executed Modal: ${interaction.customId} (Success)`);
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
