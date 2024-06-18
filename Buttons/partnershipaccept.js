const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { embedInfoSuccess } = require("../embeds.js");

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
        
        if (!user) {
            const embed = new EmbedBuilder(embedInfoSuccess.Template)
                .setTitle("Partnership Accepted")
                .setDescription("Your partnership request has been accepted.")
                .setFooter(`Failed to Ping user`)
                .setTimestamp();
            return interaction.reply("User not found.");
        }
        
        const embed = new EmbedBuilder(embedInfoSuccess.Template)
            .setTitle("<:DG_CO_Check:1028309734450806815>⠀Partnership Accepted")
            .setDescription(`<@${user.user.id}>, your partnership has been accepted. Please wait for further instructions by the staff team to complete the partnership. \n⠀`)
            .setThumbnail('https://cdn.discordapp.com/emojis/1172188410522386533.webp?size=22&quality=lossless')
            .setFooter({ text: 'Connect', iconURL: 'https://cdn.discordapp.com/emojis/1203623412271022150.webp?size=80&quality=lossless' })
            .setTimestamp();

        await interaction.channel.setName(`${user.user.username} - Accepted`);
        await interaction.reply({ content: `<@${user.user.id}>`, embeds: [embed] });
    },
};
