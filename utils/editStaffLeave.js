const axios = require("axios");
const { embedInfoError } = require("../embeds.js");

/*
 * @param required {data} the data to be sent to the database
 * @param required {CommandInteraction} interaction The interaction object it uses this to update other data for you
 * @returns whatever the database returns
 */

async function editStaffLeave(data, interaction) {
    if (interaction) {
        data.ServerID = interaction.guild.id;
    }

    try {
        const response = await axios.put(
            `${process.env.DATABASE_URL}${process.env.STORAGE_PATH}/servers/staffmanagement/staffleave`,
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

module.exports = editStaffLeave;
