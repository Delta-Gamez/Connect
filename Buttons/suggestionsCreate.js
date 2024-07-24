const { ModalBuilder, ActionRowBuilder, TextInputBuilder } = require("discord.js");

module.exports = {
    data: {
        customId: "suggestionsCreate",
    },
    async execute(interaction) {
        const form = new ModalBuilder()
            .setCustomId("suggestionsCreateForm")
            .setTitle('Sumbit a Suggestions Request');

        const descriptionInput = new TextInputBuilder()
            .setCustomId("suggestionDescription")
            // NOTE: If you want to modify the Label below, we believe it needs to be under 50 characters. Any more, and it will throw an error.
            .setLabel('Suggestion')
            .setRequired(true)
            .setMinLength(10)
            .setMaxLength(400)
            .setStyle(2)
            .setPlaceholder("Write your suggestion...");

        const actionRow1 = new ActionRowBuilder().addComponents(descriptionInput);

        form.addComponents(actionRow1);
        await interaction.showModal(form);
    },
};