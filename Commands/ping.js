const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Ping the bot.'),
	async execute(interaction) {
        const pingembed = new EmbedBuilder()
            .setColor('#004898')
            .setTitle('Pong!')
            .setDescription(`Latency is ${interaction.client.ws.ping}ms.`);
        await interaction.reply({
            embeds:[pingembed],
            ephemeral: true
        });
	},
};

