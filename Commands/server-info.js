const { SlashCommandBuilder } = require("discord.js");
const { embedAbout } = require("../embeds.js");
const { getServer } = require("../utils/utils.js");

module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("Provides Infomation about your server."),
    async execute(interaction) {
        try{
            const serverData = await getServer(interaction);
            const embed = await embedAbout.ServerInfo(serverData, interaction.guild);
            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
        }

    },
};
