const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { info } = require("../src/log.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("test the bot."),
    async execute(interaction) {
        info("test")
        const pingingEmbed = new EmbedBuilder()
            .setColor("#004898")
            .setTitle("Testing");

        interaction.reply({ embeds: [pingingEmbed] });
    },
};
