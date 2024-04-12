const { Interaction } = require('discord.js');
const { info, warn, error, nolog } = require('../src/log.js');
const config = require('../config.json');
const { ServerErrorformconnectionerror, accountloggedin } = require('../embeds.js');
const axios = require('axios');

/**
 * @param {Interaction} interaction
 */
async function login(interaction) {
    const username = interaction.fields.getTextInputValue('login-set-username');
    const password = interaction.fields.getTextInputValue('login-set-password');

    const response = await axios.post(`${config['database-URL']}${config['storage-path']}/users/loginwuser/addid`, {
        DiscordID: interaction.member.id,
        username: username,
        password: password,
        tokennotwanted: true
    })

    info(response)
    if(response.status != 200) {
        await interaction.reply({
            embeds: [ServerErrorformconnectionerror]
        });
        return;
    }

    await interaction.reply({
        embeds: [accountloggedin]
    });
}

module.exports = {
    data: {
        name: 'login modal submit',
        customId: 'login-submit',
        description: 'Process submitted login modals.',
    },
    async execute(interaction) {
        await login(interaction);
    }
};
