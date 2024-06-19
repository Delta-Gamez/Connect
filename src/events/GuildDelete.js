const { custom } = require('../log.js');
const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    name: 'guildDelete',
    execute: async (guild) => {
        const embed = new EmbedBuilder()
            .setTitle("Guild Left")
            .setDescription(`Guild Data:\nID: ${guild.id}\nName: ${guild.name}\nOwner: ${guild.ownerId}\nMembers: ${guild.memberCount}\nBanner: ${guild.bannerURL()}`)
            .setTimestamp();

        if (guild.iconURL()) {
            embed.setThumbnail(guild.iconURL());
        }

        custom("Guild Left", `Left Guild: ${guild.name} (${guild.id})`, "#", embed);

        data = {
            ServerID: guild.id,
            ServerName: guild.name,
            MemberCount: guild.memberCount,
            ServerIcon: guild.iconURL(),
            ServerBanner: guild.bannerURL(),
            ServerOwner: guild.ownerId,
            Connect: false,
            PartnerShip: false,
        };
    
        try{
            await axios.put(
                `${process.env.DATABASE_URL}${process.env.STORAGE_PATH}/servers`,
                data,
                {
                    headers: {
                        Authorization: `${process.env.DATABASE_TOKEN}`,
                    },
                    withCredentials: true,
                },
            );
        } catch (e) {}
    }
};
