const { EmbedBuilder } = require("discord.js");
const { custom } = require("../log.js");
const axios = require("axios");

module.exports = {
    name: "guildMemberAdd",
    execute: async (member) => {
        const guild = member.guild;

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