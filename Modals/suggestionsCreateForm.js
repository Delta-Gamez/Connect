const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const { embedSuggestion } = require("../embeds.js");

module.exports = {
    data: {
        name: "suggestionsCreateForm",
        customId: "suggestionsCreateForm",
        description: "Process Suggestions.",
    },
    async execute(interaction) {
        // Extract the partnership decline reason
        const suggestionDescription = await interaction.fields.getTextInputValue("suggestionDescription");

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

        let embeds = await embedSuggestion.createdSuggestion(interaction.guild, interaction.user, suggestionDescription);
        await interaction.message.edit({  components: [row], content: '', embeds: [embeds] });
        await interaction.message.startThread({ name: suggestionDescription, autoArchiveDuration: 1440 });


        let embed = await embedSuggestion.SuggestionsChannel(0, interaction.guild);

        let createButton = new ButtonBuilder()
            .setCustomId("suggestionsCreate")
            .setLabel("Create")
            .setStyle(ButtonStyle.Primary);

        let actionRow = new ActionRowBuilder().addComponents(createButton);

        interaction.channel.send({ embeds: [embed], components: [actionRow] });

        let embede = await embedSuggestion.createdSuggestionUser(suggestionDescription);

        interaction.reply({ embeds: [embede], ephemeral: true });

    }
};