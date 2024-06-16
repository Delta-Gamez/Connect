const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { info } = require("../src/log.js");

module.exports = {
    global: false,
    data: new SlashCommandBuilder()
        .setName("promote")
        .setDescription("Promote a User")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        info("Promote")
        const pingingEmbed = new EmbedBuilder()
            .setColor("#004898")
            .setTitle("Massive work in progress!");

        interaction.reply({ embeds: [pingingEmbed] });
    },
};
