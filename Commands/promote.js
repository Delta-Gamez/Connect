const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { info } = require("../src/log.js");

module.exports = {
    global: false,
    data: new SlashCommandBuilder()
        .setName("promote")
        .setDescription("Promote a User"),
    async execute(interaction) {
        info("Promote")
        const pingingEmbed = new EmbedBuilder()
            .setColor("#004898")
            .setTitle("Massive work in progress!");

        interaction.reply({ embeds: [pingingEmbed] });
    },
};
