const { SlashCommandBuilder } = require("discord.js");
const { embedAbout } = require("../embeds.js");

module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName("about")
        .setDescription("Provides Infomation about Connect."),
    async execute(interaction) {
        interaction.reply({ embeds: [embedAbout.About] });
    },
};
