const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Ping the bot."),
    async execute(interaction) {
        const pingingEmbed = new EmbedBuilder()
            .setColor("#004898")
            .setTitle("Pinging");

        const sent = await interaction.reply({
            embeds: [pingingEmbed],
            fetchReply: true,
            ephemeral: true,
        });

        const pingEmbed = new EmbedBuilder()
            .setColor("#004898")
            .setTitle("Pong!")
            .setDescription(
                `Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms\nAPI Latency: ${Math.round(interaction.client.ws.ping)}ms`,
            );

        await interaction.editReply({
            embeds: [pingEmbed],
        });
    },
};
