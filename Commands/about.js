const { SlashCommandBuilder } = require("discord.js");
const { info } = require("../src/log.js");
const { embedAbout } = require("../embeds.js");

module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName("about")
        .setDescription("Provides infomation about Connect."),
    async execute(interaction) {
        interaction.reply({ embeds: [embedAbout.About] });
    },
};
