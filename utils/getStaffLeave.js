const axios = require("axios");
const { embedInfoError } = require("../embeds.js");

const timeout = 2500
/*
    * @param required {CommandInteraction} interaction The interaction object it uses this to update other data for you
    * @returns whatever the database returns
*/

async function getStaffLeave(interaction, StaffLeaveID) {
    try {
        const response = await axios.get(
            `${process.env.DATABASE_URL}${process.env.STORAGE_PATH}/servers/staffmanagement/staffleave/${StaffLeaveID}`,{
                timeout: timeout
            }
        );

        return response.data;
    } catch (error) {
        console.error(error)
        if(interaction.customId){
            await interaction.update({embeds: [embedInfoError.ServerConnectionError], components: []})
        } else {
            await interaction.reply({embeds: [embedInfoError.ServerConnectionError], components: []})
        }
    }
}

module.exports = getStaffLeave;