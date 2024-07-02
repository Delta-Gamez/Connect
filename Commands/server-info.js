const { SlashCommandBuilder } = require("discord.js");
const { embedAbout } = require("../embeds.js");

module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("Provides Infomation about your server."),
    async execute(interaction) {
        const serverData = await getServer(interaction);

        const embed = await embedAbout.serverInfo(serverData, interaction.guild);
        interaction.reply({ embeds: [embed] });
    },
};
