const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionsBitField  } = require("discord.js");
const { embedInfoSuccess } = require("../embeds.js");

module.exports = {
    data: {
        customId: "partnership-decline",
    },
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({ content: `You do not have the required permissions to use this Button.\nPlease ask the Staff Team to Decline/Close the Partnership Request`, ephemeral: true });
        }
        const form = new ModalBuilder()
        .setCustomId("partnership-decline")
        .setTitle("Decline Partnership Request");

        const descriptionInput = new TextInputBuilder()
            .setCustomId("partnership-decline-reason")
            // NOTE: If you want to modify the Label below, we believe it needs to be under 50 characters. Any more, and it will throw an error.
            .setLabel(`Describe the reason.`)
            .setRequired(true)
            .setMinLength(5)
            .setMaxLength(400)
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder("Write your reason...");

        const actionRow1 = new ActionRowBuilder().addComponents(descriptionInput);
        form.addComponents(actionRow1);
        await interaction.showModal(form);
    }
};