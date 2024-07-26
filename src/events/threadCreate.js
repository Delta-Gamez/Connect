const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { custom } = require("../log.js");
const { embedSuggestion } = require("../../embeds.js");
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

        if (thread.parentId != data.server.SuggestionsChannel) {
            return;
        }

        const suggestionDescription = messsage.content;

        let Approve = new ButtonBuilder()
            .setCustomId("suggestions-approve")
            .setLabel("Approve")
            .setStyle(ButtonStyle.Primary);
        let Deny = new ButtonBuilder()
            .setCustomId("suggestions-deny")
            .setLabel("Deny")
            .setStyle(ButtonStyle.Danger);

        let row = new ActionRowBuilder().addComponents(
            Approve,
            Deny,
        );

        let embeds = await embedSuggestion.createdSuggestion(thread.guild, messsage.author, suggestionDescription);

        await thread.send({embeds: [embeds], components: [row]});
    },
};