const { EmbedBuilder } = require("discord.js");
const { custom } = require("../log.js");
const axios = require("axios");

module.exports = {
    name: "guildMemberAdd",
    execute: async (member) => {
        const guild = member.guild;
        /*
            const embed = new EmbedBuilder()
                .setTitle("New Member Joined")
                .setDescription(`Member Data:\nID: ${member.id}\nUsername: ${member.user.username}\nGuild: ${guild.name}(${guild.id})\nMembers: ${guild.memberCount}`)
                .setTimestamp();

            if (member.user.avatarURL()) {
                embed.setThumbnail(member.user.avatarURL());
            }

            custom("New Member Joined", `New Member: ${member.user.username} (${member.id}) joined Guild: ${guild.name} (${guild.id})`, "#", embed);
        */

        data = {
            ServerID: guild.id,
            ServerName: guild.name,
            MemberCount: guild.memberCount,
            ServerIcon: guild.iconURL(),
            ServerBanner: guild.bannerURL(),
            ServerOwner: guild.ownerId,
        };
    
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
    },
};