const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { info } = require("../src/log.js");

module.exports = {
    global: false,
    data: new SlashCommandBuilder()
        .setName("loa")
        .setDescription("The LOA COmmand."),
    async execute(interaction) {
        info("loa")
        const pingingEmbed = new EmbedBuilder()
            .setColor("#004898")
            .setTitle("Massive work in progress!");

        interaction.reply({ embeds: [pingingEmbed] });
    },
};
