const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: {
        name: "partnership-decline",
        customId: "partnership-decline",
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


        const embed = new EmbedBuilder()
        .setTitle("Partnership Declined")
        .setDescription(`Your partnership request has been denied by a staff member for: ${partnershipDeclineReason}`)
        .setTimestamp();

        if(!user) {
            const embed2 = new EmbedBuilder(embed)
                .setFooter("Failed to Ping user")
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