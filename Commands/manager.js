const { SlashCommandBuilder } = require("discord.js");
const { info, error } = require("../src/log.js");



module.exports = {
    data: new SlashCommandBuilder()
        .setName("manager")
        .setDescription("Staff Management Commands"),
    async execute(interaction) {
        if (!interaction.guildId) {
            interaction.reply()
        }
    }
}
