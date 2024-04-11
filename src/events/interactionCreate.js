const { info, warn, error, nolog } = require('../log.js');

 module.exports = {
	name: 'interactionCreate',
	execute: async(interaction) => {
		if (interaction.isAutocomplete()) {
			const command = interaction.client.slashcommands.get(interaction.commandName);
			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}
			try {
				await command.autocomplete(interaction);
			} catch (error) {
				console.error(error);
			}
			return;
		}
		const client = interaction.client;
		
		if (interaction.isCommand()) {
			const command = client.commands.get(interaction.commandName);
			if (!command) {
				info(`Interaction Requested: ${interaction.commandName} (Not Found)`);
				await interaction.reply({
					content:`Command ${interaction.commandName} not found.`,
					ephemeral: true
				});
				return;
			};
			info(`Interaction Requested: ${interaction.commandName} (Success)`);
			try {
				await command.execute(interaction);
				info(`Executed Command: ${interaction.commandName} (Success)`);
			} catch (e) {
				error(`Error while Executing Command ${interaction.commandName}: ${e}`);
				if (interaction.deferred || interaction.replied) {
					await interaction.editReply({
						content: 'There was an error running that command. Try again later, or if the error persists, let us know.'
					});
				} else {
					await interaction.reply({
						content: 'There was an error running that command. Try again later, or if the error persists, let us know.'
					});
				}
			}
		} else if (interaction.isButton()) {
			const button = client.buttons.get(interaction.customId);
			if (!button) {
				info(`Button Requested: ${interaction.customId} (Not Found)`);
				await interaction.reply({
					content:`Button ${interaction.customId} not found.`,
					ephemeral: true
				});
				return;
			}
			info(`Button Requested: ${interaction.customId} (Success)`);
			try {
				await button.execute(interaction);
				info(`Executed Button: ${interaction.customId} (Success)`);
			} catch (e) {
				error(`Error while Executing Button ${interaction.customId}: ${e}`);
			}
		} else if (interaction.isModalSubmit()) {
			const modal = client.modals.get(interaction.customId);
			if (!modal) {
				info(`Modal Requested: ${interaction.customId} (Not Found)`);
				await interaction.reply({
					content:`Modal ${interaction.customId} not found.`,
					ephemeral: true
				});
				return;
			}
			info(`Modal Requested: ${interaction.customId} (Success)`);
			try {
				await modal.execute(interaction);
				info(`Executed Modal: ${interaction.customId} (Success)`);
			} catch (e) {
				error(`Error while Executing Modal ${interaction.customId}: ${e}`);
			}
		}
  }}
