const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { info } = require("../src/log.js");
const { embedAbout } = require("../embeds.js");

module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Provides Infomation about Connect."),
    async execute(interaction) {
        interaction.reply({ embeds: [embedAbout.About] });
    },
};
