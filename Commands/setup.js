const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { info } = require('../src/log.js');
const { serverlerror } = require('../embeds.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setup')
		.setDescription('Setup Connect')
        .addSubcommand(subcommand =>
            subcommand
                .setName('partnership')
                .setDescription('Setup Partnership')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('The channel to send Request Partnership to.') 
                        .setRequired(true)
                )
        ),
	async execute(interaction) {
        info(interaction)
        info(interaction.options.getSubcommand())

        // Partnership Setup
        if (interaction.options.getSubcommand() === 'partnership') {
            const channel = interaction.options.getChannel('channel')
            console.log(channel)
            if (channel.type !== 0) {
                await interaction.reply('Please select a text channel.');
                return;
            }

            await interaction.reply({
                content: `Partnership Channel set to ${channel}`,
                ephemeral: true
            });
            return;
        }

        // None Selected
        await interaction.reply({
            embeds:[serverlerror],
            ephemeral: true
        });
	},
};

