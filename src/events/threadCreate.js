const { EmbedBuilder } = require("discord.js");
const { custom } = require("../log.js");
const { getServer } = require("../../utils/utils.js");

module.exports = {
    name: "threadCreate",
    execute: async (thread) => {
        let messsage = await thread.fetchStarterMessage();
        if(messsage.author.bot){
            return;
        }

        const guild = thread.guild;

        if (!guild) {
            return;
        }

        const data = await getServer(thread);

        if (!data) {
            return;
        }

        if(!data.server.Suggestions){
            return;
        }

        if (thread.channel.id != data.server.SuggestionsChannel) {
            return;
        }

        if (thread.author.avatarURL()) {
            embed.setThumbnail(thread.author.avatarURL());
        }

        custom("New Suggestion", `New Suggestion: ${thread.author.username} (${thread.id}) in Guild: ${guild.name} (${guild.id})`, "#", embed);

        await thread.react("👍");
    },
};