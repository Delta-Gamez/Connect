const axios = require("axios");
const { embedInfoError } = require("../embeds.js");

/*
 * @param required {data} the data to be sent to the database
 * @param required {CommandInteraction} interaction The interaction object it uses this to update other data for you
 * @returns whatever the database returns
 */

async function createDatabase(data, interaction) {
    if (interaction) {
        data.ServerID = interaction.guild.id;
        data.ServerName = interaction.guild.name;
        data.MemberCount = interaction.guild.memberCount;
        data.ServerIcon = interaction.guild.iconURL();
        data.ServerBanner = interaction.guild.bannerURL();
        data.ServerOwner = interaction.guild.ownerId;
    }

    try {
        const response = await axios.post(
            `${process.env.DATABASE_URL}${process.env.STORAGE_PATH}/servers`,
            data,
            {
                headers: {
                    Authorization: `${process.env.DATABASE_TOKEN}`,
                },
                withCredentials: true,
            },
        );

        return response;
    } catch (error) {
        if (interaction) {
            interaction.reply({
                embeds: [embedInfoError.ServerConnectionError],
            });
        }
        throw new Error(error);
    }
}

module.exports = createDatabase;
