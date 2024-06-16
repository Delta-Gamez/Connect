const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { info } = require("../src/log.js");

module.exports = {
    global: false,
    data: new SlashCommandBuilder()
        .setName("demote")
        .setDescription("Demote a User")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        info("Demote")
        const pingingEmbed = new EmbedBuilder()
            .setColor("#004898")
            .setTitle("Massive work in progress!");

        interaction.reply({ embeds: [pingingEmbed] });
    },
};
