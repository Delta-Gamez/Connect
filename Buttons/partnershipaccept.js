const { PermissionsBitField } = require("discord.js");
const { embedPartnership } = require("../embeds.js");

module.exports = {
    data: {
        customId: "partnershipaccept",
    },
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({content: `You do not have the required permissions to use this Button.\nPlease ask the Staff Team to Accept the Partnership Request`, ephemeral: true});
        }
        const userId = await interaction.channel.name.split(':')[0];
        let user
        if (userId) {
            user = await interaction.guild.members.fetch(userId);
        }
        
       const embed = embedPartnership.partershipAccepted(user)

        await interaction.channel.setName(`${user ? user.user.username : "User not defined"} - Accepted`);
        
        await interaction.reply({ content: `<@${user ? user.user.id : "User not pinged"}>`, embeds: [embed] });
    },
};
