const { embedPartnership } = require("../embeds.js");

module.exports = {
    data: {
        name: "partnershipdecline",
        customId: "partnershipdecline",
        description: "Process partnerships decline.",
    },
    async execute(interaction) {
        const partnershipDeclineReason = interaction.fields.getTextInputValue("partnership-decline-reason")
        
        let user;
        let userId;
        if(interaction.channel){
            const userId = await interaction.channel.name.split(':')[0];
            
            if (userId) {
                user = await interaction.guild.members.fetch(userId);
            }        
        }


        const embed = await embedPartnership.partnershipDeclineReason(partnershipDeclineReason);

        if(!user) {
            const embed2 = embedPartnership.partnershipFailedtoPingUser(embed);
            return interaction.reply({embeds: [embed2]});
        }

        try {
            await interaction.reply({ content: `<@${user.user.id}>`, embeds: [embed] });  
            await interaction.channel.setName(`${user.user.username} - Declined`);
            await interaction.channel.setArchived(true);
        } catch (error) {
            console.error(error);
        }
    }
};