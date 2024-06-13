const { ModalBuilder, ActionRowBuilder, TextInputBuilder } = require("discord.js");

module.exports = {
    data: {
        customId: "staffleaverequest",
    },
    async execute(interaction) {
        const form = new ModalBuilder()
            .setCustomId("staffleaverequest-submit")
            .setTitle('Sumbit a Staff Leave Request');

        const descriptionInput = new TextInputBuilder()
            .setCustomId("staffleaverequest-reason")
            // NOTE: If you want to modify the Label below, we believe it needs to be under 50 characters. Any more, and it will throw an error.
            .setLabel('Leave Reason')
            .setRequired(true)
            .setMinLength(10)
            .setMaxLength(400)
            .setStyle(2)
            .setPlaceholder("Write you reason for your leave...");

        const startDateInput = new TextInputBuilder()
            .setCustomId("staffleaverequest-startdate")
            .setLabel('Start Date in the format of DD/MM/YYYY')
            .setMaxLength(10)
            .setMinLength(10)
            .setPlaceholder("12-06-2024")
            .setRequired(true)
            .setStyle(1)
            .setPlaceholder("Input a data in the format of DD/MM/YYYY UTC");

        const endDateInput = new TextInputBuilder()
            .setCustomId("staffleaverequest-enddate")
            .setLabel('End Date in the format of DD/MM/YYYY')
            .setMaxLength(10)
            .setMinLength(10)
            .setPlaceholder("12-06-2024")
            .setRequired(true)
            .setStyle(1)
            .setPlaceholder("Input a data in the format of DD/MM/YYYY UTC");

        const actionRow1 = new ActionRowBuilder().addComponents(descriptionInput);
        const actionRow2 = new ActionRowBuilder().addComponents(startDateInput);
        const actionRow3 = new ActionRowBuilder().addComponents(endDateInput);

        form.addComponents(actionRow1, actionRow2, actionRow3);
        await interaction.showModal(form);
    },
};