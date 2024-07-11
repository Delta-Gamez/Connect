const { PermissionsBitField } = require("discord.js");
const { embedPartnership } = require("../embeds.js");

module.exports = {
    data: {
        customId: "partnershipaccept",
    },
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({embeds: [embedPartnership.ButtonApproveDeclinePermission], ephemeral: true});
        }
        if(interaction.channel.name.endsWith("- Accepted")) return interaction.reply({embeds: [embedPartnership.RequestAlreadyAccepted], ephemeral: true});

        const changeEmbed = await embedPartnership.PartnershipAccepted(null)  
        

        if(interaction.channel.name.endsWith("- Declined")) {
            const channelName = interaction.channel.name.replace("- Declined", "- Accepted");
            await interaction.channel.setName(channelName);
            await interaction.channel.setArchived(false);
            return await interaction.reply({embeds: [changeEmbed]});
        } 

        const userId = await interaction.channel.name.split(':')[0];
        let user
        if (userId) {
            user = await interaction.guild.members.fetch(userId);
        }
        
        const embed = await embedPartnership.PartnershipAccepted(user)

        await interaction.channel.setName(`${user ? user.user.username : "User not defined"} - Accepted`);
        
        await interaction.reply({ content: `<@${user ? user.user.id : "User not pinged"}>`, embeds: [embed] });
    },
};
