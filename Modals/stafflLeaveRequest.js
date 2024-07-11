const { checkDateFormat, createStaffLeave, getServer } = require("../utils/utils.js");
const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const { embedManage } = require("../embeds.js");

module.exports = {
    data: {
        name: "staffleaverequestsubmit",
        customId: "staffleaverequestsubmit",
        description: "Process StaffLeave Requests.",
    },
    async execute(interaction) {
        const staffLeaveReason = await interaction.fields.getTextInputValue("staffleaverequest-reason")
        const staffLeaveStartDate = await interaction.fields.getTextInputValue("staffleaverequest-startdate")
        const staffLeaveEndDate = await interaction.fields.getTextInputValue("staffleaverequest-enddate")
    
        if (!staffLeaveReason || !staffLeaveStartDate || !staffLeaveEndDate) {
            interaction.reply({ content: "Please fill in all fields.", ephemeral: true });
            return;
        }

        const leavestartformat = await checkDateFormat(staffLeaveStartDate)
        const leaveendformat = await checkDateFormat(staffLeaveEndDate)

        if (!leavestartformat || !leaveendformat) {
            interaction.reply({ content: "Invalid date format. Please use DD/MM/YYYY", ephemeral: true });
            return;
        }


        const staffLeaveStartDateFormatted = new Date(convertDateFormat(staffLeaveStartDate)).toISOString();
        const staffLeaveEndDateFormatted = new Date(convertDateFormat(staffLeaveEndDate)).toISOString();
        
        const data = {
            Reason: staffLeaveReason,
            StartDate: new Date(staffLeaveStartDateFormatted),
            EndDate: new Date(staffLeaveEndDateFormatted),
            UserID: interaction.member.id,
        }
        staffleave = await createStaffLeave(data, interaction)
        if(!staffleave.data.staffleave){
            return interaction.reply({content: `Unable to create StaffLeave.`, ephemeral: true})
        }
        staffleave = staffleave.data.staffleave
        
        embed = await embedManage.StaffLeaveReviewFormat(interaction, staffleave.StaffLeaveID)

        server = await getServer(interaction)
        if(!server){
            return interaction.reply({content: `Unable to find server.`, ephemeral: true})
        }

        const approvebutton = new ButtonBuilder()
            .setCustomId(`staffleaveapprove-${staffleave.StaffLeaveID}`)
            .setLabel("Approve")
            .setStyle(ButtonStyle.Success)

        const declinebutton = new ButtonBuilder()
            .setCustomId(`staffleavedecline-${staffleave.StaffLeaveID}`)
            .setLabel("Decline")
            .setStyle(ButtonStyle.Danger)

        const row = new ActionRowBuilder().addComponents(approvebutton, declinebutton)

        if(server.server.RequestStaffLeaveChannel){
            channel = await interaction.guild.channels.cache.get(server.server.RequestStaffLeaveChannel)
            if(!channel){
                return interaction.reply({embeds: [embedManage.StaffChannelNotFound], ephemeral: true})
            }
            await channel.send({embeds: [embed], components: [row]});
            await interaction.reply({embeds: [embedManage.StaffLeaveSubmitted], ephemeral: true});
        } else {
            await interaction.reply({embeds: [embedManage.StaffChannelNotFound], ephemeral: true})
        }
        
    }
};

function convertDateFormat(inputDate) {
    let [day, month, year] = inputDate.split("/");
    return `${month}/${day}/${year}`;
}