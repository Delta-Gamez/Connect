const { embedPartnership } = require("../embeds.js");

module.exports = {
    data: {
        name: "partnershipdecline",
        customId: "partnershipdecline",
        description: "Process partnerships decline.",
    },
    async execute(interaction) {
        console.log("partnershipdecline")
        // Extract the partnership decline reason
        const partnershipDeclineReason = await interaction.fields.getTextInputValue("partnership-decline-reason");
        const embed = await embedPartnership.PartnershipDeclineReason(partnershipDeclineReason);

        // Change channel name if it ends with "- Accepted"
        if (interaction.channel.name.endsWith("- Accepted")) {
            await interaction.reply({ embeds: [embed] });
            const channelName = await interaction.channel.name.replace("- Accepted", "- Declined");
            await interaction.channel.setName(channelName);
            await interaction.channel.setArchived(true);
            return;
        }

        // Attempt to notify the user
        try {
            let user;
            if (interaction.channel) {
                const userId = interaction.channel.name.split(':')[0];
                if (userId) {
                    user = await interaction.guild.members.fetch(userId).catch(console.error);
                }
            }

            if (user) {
                await interaction.reply({ content: `<@${user.user.id}>`, embeds: [embed] });
                await interaction.channel.setName(`${user.user.username} - Declined`);
                await interaction.channel.setArchived(true);
                console.log("partnershipdecline - Notify user - Success")
            } else {
                // Handle case where user cannot be fetched or pinged
                const embed2 = embedPartnership.PartnershipFailedtoPingUser(embed);
                await interaction.reply({ embeds: [embed2] });
            }
        } catch (error) {
            console.error(error);
        }
    }
};