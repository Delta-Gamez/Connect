const { checkDateFormat, createStaffLeave, getServer } = require("../utils/utils.js");
const { embedManage } = require("../embeds.js");

module.exports = {
    data: {
        name: "staffleaverequest-submit",
        customId: "staffleaverequest-submit",
        description: "Process StaffLeave Requests.",
    },
    async execute(interaction) {
        const staffLeaveReason = interaction.fields.getTextInputValue("staffleaverequest-reason")
        const staffLeaveStartDate = interaction.fields.getTextInputValue("staffleaverequest-startdate")
        const staffLeaveEndDate = interaction.fields.getTextInputValue("staffleaverequest-enddate")

        if (!checkDateFormat(staffLeaveStartDate) || !checkDateFormat(staffLeaveEndDate)) {
            return interaction.reply({ content: "Invalid date format. Please use DD/MM/YYYY", ephemeral: true });
        }

        const data = {
            Reason: staffLeaveReason,
            StartDate: staffLeaveStartDate,
            EndDate: staffLeaveEndDate,
            UserID: interaction.member.id,
        }
        staffleave = await createStaffLeave(data, interaction)
        staffleave = staffleave.data.staffleave
        
        embed = await embedManage.StaffLeaveReviewFormat(interaction, staffleave.StaffLeaveID)

        server = await getServer(interaction)

        if(server.server.RequestStaffLeaveChannel){
            channel = await interaction.guild.channels.cache.get(server.server.RequestStaffLeaveChannel)
            if(channel){
                await channel.send({embeds: [embed]});
            }
            await interaction.reply({embeds: [embedManage.StaffLeaveSubmitted], ephemeral: true});
        } else {
            await interaction.reply({content: `Unable to find Staff Leave Channel. Please contact the server owner.`, ephemeral: true})
        }
        
    }
};