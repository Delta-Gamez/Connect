const { custom } = require('../log.js');
const { EmbedBuilder } = require("discord.js");

const colorSuccess = '#45BB8A';

module.exports = {
	name: 'guildCreate',
	execute: async(guild) => {
        console.log(guild)
        const user = await guild.members.fetch(guild.ownerId);
        const embed = new EmbedBuilder()
            .setTitle('GUILD JOINED')
            .setColor(colorSuccess)
            .setDescription(`
                **Server**: ${guild.name}, ${guild.id}
                **Server Owner**: ${user.user.username}(${guild.ownerId})
                **Members:** ${guild.memberCount}`)
            .setTimestamp()
            .setFooter('Connect Logs');

        if (guild.iconURL()) {
            embed.setThumbnail(guild.iconURL());
        }

        custom("Guild Joined", `Joined Guild: ${guild.name} (${guild.id})`, "#", embed);
}};