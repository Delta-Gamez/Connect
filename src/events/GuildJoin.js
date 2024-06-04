const { custom } = require('../log.js');
const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: 'guildCreate',
	execute: async(guild) => {
        console.log(guild)
        const user = await guild.members.fetch(guild.ownerId);
        const embed = new EmbedBuilder()
            .setTitle("Guild Joined")
            .setDescription(`Guild Data:\nID: ${guild.id}\nName: ${guild.name}\nOwner: ${user.user.username}(${guild.ownerId})\nMembers: ${guild.memberCount}\nBanner: ${guild.bannerURL()}`)
            .setTimestamp();

        if (guild.iconURL()) {
            embed.setThumbnail(guild.iconURL());
        }

        custom("Guild Joined", `Joined Guild: ${guild.name} (${guild.id})`, "#", embed);
}};