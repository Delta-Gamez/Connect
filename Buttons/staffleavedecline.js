const { ModalBuilder, ActionRowBuilder, TextInputBuilder } = require("discord.js");

module.exports = {
    data: {
        customId: "staffleavedecline",
    },
    async execute(interaction) {
        const id = interaction.customId.split("-")[1];

        const form = new ModalBuilder()
            .setCustomId(`staffleavedecline-${id}`)
            .setTitle('Sumbit a Staff Leave Request');

        const descriptionInput = new TextInputBuilder()
            .setCustomId("staffleavedecline-reason")
            // NOTE: If you want to modify the Label below, we believe it needs to be under 50 characters. Any more, and it will throw an error.
            .setLabel('Decline Reason')
            .setRequired(true)
            .setMinLength(10)
            .setMaxLength(400)
            .setStyle(2)
            .setPlaceholder("Why are you declining this leave request?");

        const actionRow1 = new ActionRowBuilder().addComponents(descriptionInput);
        form.addComponents(actionRow1);
        await interaction.showModal(form);
    },
};