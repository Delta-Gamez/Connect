const axios = require("axios");
const { embedInfoError } = require("../embeds.js");

const timeout = 2500
/*
    * @param required {CommandInteraction} interaction The interaction object it uses this to update other data for you
    * @param required {JSON} data The data to update the suggestion
    * @returns whatever the database returns
*/

async function updateSuggestion(interaction, data) {
    try {
        const response = await axios.put(
            `${process.env.DATABASE_URL}${process.env.STORAGE_PATH}/servers/suggestions`,
            data,
            {
                headers: {
                    Authorization: `${process.env.DATABASE_TOKEN}`,
                },
                withCredentials: true,
            },
        );

        return response.data;
    } catch (error) {
        if(interaction.customId){
            await interaction.update({embeds: [embedInfoError.ServerConnectionError], components: []})
        } else {
            try{
                await interaction.reply({embeds: [embedInfoError.ServerConnectionError], components: []})
            } catch (e) {
                console.log(e)
            }
        }
        return null;
    }
}

module.exports = updateSuggestion;