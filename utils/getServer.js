const axios = require("axios");
const { embedInfoError } = require("../embeds.js");

const timeout = 2500
/*
    * @param required {CommandInteraction} interaction The interaction object it uses this to update other data for you
    * @returns whatever the database returns
*/

async function getServer(interaction) {
    try {
        const response = await axios.get(
            `${process.env.DATABASE_URL}${process.env.STORAGE_PATH}/servers/find/${interaction.guild.id}`,{
                timeout: timeout
            }
        );

        return response.data;
    } catch (error) {
        if(interaction.customId){
            await interaction.update({embeds: [embedInfoError.ServerConnectionError], components: []})
        } else {
            await interaction.reply({embeds: [embedInfoError.ServerConnectionError], components: []})
        }
        return null;
    }
}

module.exports = getServer;