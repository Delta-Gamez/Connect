const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { editStaffLeave } = require("../utils/utils.js");
const { embedManage } = require("../embeds.js");

module.exports = {
    data: {
        customId: "staffleaveapprove",
    },
    async execute(interaction) {
        const id = interaction.customId.split("-")[1];

        const data = {
            StaffLeaveID: id,
            Status: "Approved",
            ApprovedBy: interaction.user.id,
            ApprovedDate: Date.now(),
            DeclineReason: "No Reason Provided"
        };

        staffleave = await editStaffLeave(data);

        if (staffleave.data.status !== 200) {
            return interaction.reply({ content: `Unable to approve StaffLeave.`, ephemeral: true });
        }

        const approvebutton = new ButtonBuilder()
            .setCustomId(`staffleaveapprove-${staffleave.data.staffleave.StaffLeaveID}`)
            .setLabel("Approve")
            .setStyle(ButtonStyle.Success)
            .setDisabled(true)

        const declinebutton = new ButtonBuilder()
            .setCustomId(`staffleavedecline-${staffleave.data.staffleave.StaffLeaveID}`)
            .setLabel("Decline")
            .setStyle(ButtonStyle.Danger)

        const row = new ActionRowBuilder().addComponents(approvebutton, declinebutton)

        const embed = await embedManage.StaffLeaveReviewFormat(interaction, staffleave.data.staffleave.StaffLeaveID);
        await interaction.message.edit({ embeds: [embed], components: [row]});

        await interaction.reply({ embeds: [embedManage.StaffLeaveApproved], ephemeral: true });
    },
};