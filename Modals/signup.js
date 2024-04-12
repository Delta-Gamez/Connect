const { Interaction } = require('discord.js');
const { info, warn, error, nolog } = require('../src/log.js');
const config = require('../config.json');
const { ServerErrorformconnectionerror, accountcreated } = require('../embeds.js');
const axios = require('axios');

/**
 * @param {Interaction} interaction
 */
async function signup(interaction) {
    const username = interaction.fields.getTextInputValue('signup-set-username');
    const password = interaction.fields.getTextInputValue('signup-set-password');

    const response = await axios.post(`${config['database-URL']}${config['storage-path']}/users/signup/admin`, {
        DiscordID: interaction.member.id,
        username: username,
        password: password,
    }, {
        headers: {
            "Authorization": `${config['database-token']}`
        },
        withCredentials: true
    })

    info(response)
    if(response.status != 200) {
        await interaction.reply({
            embeds: [ServerErrorformconnectionerror]
        });
        return;
    }

    await interaction.reply({
        embeds: [accountcreated]
    });
}

module.exports = {
    data: {
        name: 'signup modal submit',
        customId: 'signup-submit',
        description: 'Process submitted signup modals.',
    },
    async execute(interaction) {
        await signup(interaction);
    }
};
