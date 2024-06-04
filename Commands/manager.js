const { SlashCommandBuilder } = require("discord.js");
const { info, error } = require("../src/log.js");



module.exports = {
    data: new SlashCommandBuilder()
        .setName("manager")
        .setDescription("Staff Management Commands"), // gtg home, ill be back in a bit
    async execute(interaction) {
        if (!interaction.guildId) {
            interaction.reply()
        }
    }
}
