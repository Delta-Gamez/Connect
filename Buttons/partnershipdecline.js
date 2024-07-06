const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionsBitField  } = require("discord.js");
const { embedInfoSuccess, embedPartnership } = require("../embeds.js");

module.exports = {
    data: {
        customId: "partnershipdecline",
    },
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({ embeds: [embedPartnership.buttonApproveDeclinePermission], ephemeral: true });
        }

        if(interaction.channel.name.endsWith("- Declined")) return interaction.reply({embeds: [embedPartnership.partnershipAlreadyDeclined], ephemeral: true});
        
        const form = new ModalBuilder()
            .setCustomId("partnershipdecline")
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