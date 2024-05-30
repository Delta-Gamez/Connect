const { EmbedBuilder } = require("discord.js");
const { embedInfoSuccess } = require("../embeds.js");

module.exports = {
    data: {
        customId: "partnership-accept",
    },
    async execute(interaction) {
        const userId = await interaction.channel.name.split(':')[0];
        if (userId) {
            const user = await interaction.guild.members.fetch(userId);
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
            .setTitle("Partnership Accepted")
            .setDescription(`Your partnership request has been accepted.`)
            .setTimestamp();

        await interaction.channel.setName(`${user.user.username} - Accepted`);
        await interaction.reply({ content: `<@${userId}>`, embeds: [embed] });
    },
};