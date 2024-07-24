const { EmbedBuilder } = require("discord.js");
const { custom } = require("../log.js");
const { getServer } = require("../../utils/utils.js");

module.exports = {
    name: "messageCreate",
    execute: async (message) => {
        if(message.author.bot){
            return;
        }

        const guild = message.guild;

        if (!guild) {
            return;
        }

        const data = await getServer(message);

        if (!data) {
            return;
        }

        if(!data.server.Suggestions){
            return;
        }

        if (message.channel.id != data.server.SuggestionsChannel) {
            return;
        }

        if (message.author.avatarURL()) {
            embed.setThumbnail(message.author.avatarURL());
        }

        custom("New Suggestion", `New Suggestion: ${message.author.username} (${message.id}) in Guild: ${guild.name} (${guild.id})`, "#", embed);

        await message.react("👍");
    },
};