const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { info } = require("../src/log.js");
const { InfomationEmbed } = require("../embeds.js");

module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Provides Infomation about Connect."),
    async execute(interaction) {
        interaction.reply({ embeds: [InfomationEmbed] });
    },
};
