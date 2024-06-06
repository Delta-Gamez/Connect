const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { info } = require("../src/log.js");

module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Provides Infomation about Connect."),
    async execute(interaction) {
        const pingingEmbed = new EmbedBuilder()
            .setColor("#004898")
            .setTitle("Infomation")
            .setDescription("Connect is cool")

        interaction.reply({ embeds: [pingingEmbed] });
    },
};
