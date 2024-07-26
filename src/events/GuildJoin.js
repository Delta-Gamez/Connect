const { custom, info } = require('../log.js');
const { EmbedBuilder } = require("discord.js");
const { embedAbout } = require("../../embeds.js");

const colorSuccess = '#45BB8A';

module.exports = {
	name: 'guildCreate',
	execute: async(guild) => {
        const user = await guild.members.fetch(guild.ownerId);
        const embed = new EmbedBuilder()
            .setTitle('GUILD JOINED')
            .setColor(colorSuccess)
            .setDescription(`
                **Server**: ${guild.name}, ${guild.id}
                **Server Owner**: ${user.user.username}(${guild.ownerId})
                **Members:** ${guild.memberCount}`)
            .setTimestamp()
            .setFooter({text: 'Connect Logs'});

        if (guild.iconURL()) {
            embed.setThumbnail(guild.iconURL());
        }

        custom("Guild Joined", `Joined Guild: ${guild.name} (${guild.id})`, "#", embed);
        
        let targetChannel = guild.channels.cache.find(channel =>
          channel.name.toLowerCase().includes('general')&&
          channel.type === 0
        );
        if(!targetChannel) {
            targetChannel = guild.channels.cache.find(channel =>
              channel.name.toLowerCase().includes('chat') &&
              channel.type === 0
            );
        }
        
        if (!targetChannel) {
          const writableChannels = guild.channels.cache.filter(channel =>
            channel.type === 0
          );
          
          if (writableChannels.size > 0) {
            const channelsArray = Array.from(writableChannels.values());
            targetChannel = channelsArray[Math.floor(Math.random() * channelsArray.length)];
          }
          if(!targetChannel) {
            targetChannel = guild.systemChannel;
          }
        }
        
        if (targetChannel) {
          info(`Sending welcome message to ${guild.name} (${guild.id}), in channel ${targetChannel.name} (${targetChannel.id})`);
          targetChannel.send({ embeds: [embedAbout.GetStarted], content: `<@${guild.ownerId}>` }).catch(console.error);
        }
}};