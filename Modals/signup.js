require('dotenv').config();
const { Interaction } = require('discord.js');
const { info, warn, error, nolog } = require('../src/log.js');
const config = require('../config.json');
const { signupformsumbit, serverowner, signupformerror, signupformconnectionerror } = require('../embeds.js');

/**
 * @param {Interaction} interaction
 */
async function signup(interaction) {
    if (!(interaction.member.id && interaction.guild.ownerId && parseInt(interaction.member.id) === parseInt(interaction.guild.ownerId))) {
        
        await interaction.reply({
            embeds: [serverowner]
        });
        return;
    }
    info('Modal Signup Submitted for Processing.');
    await interaction.reply({
        embeds: [signupformsumbit]
    });
    try {
        const invite = await interaction.channel.createInvite({
            maxUses: 0,
            maxAge: 0,
            unique: true
        });
        data = {
            guildId: interaction.guild.id,
            guildName: interaction.guild.name,
            guildIcon: interaction.guild.iconURL(),
            guildBanner: interaction.guild.bannerURL(),
            shortDesc: String(interaction.fields.getTextInputValue('signup-set-description')),
            memberCount: interaction.guild.memberCount,
            guildInvite: String(invite.url)
        }
    } catch (e) {
        error(`Error while creating server data: ${e}`);
        await interaction.editReply({
            embeds: [signupformerror]
        });
        return;
    }
    info(`A new server will be submitted for approval. The following server data will be sent:${JSON.stringify(data)}`);
    try {
    fetch(config['database-URL']+config['storage-path'], {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            // Send the token in the Authorization header
            "Authorization": `Bearer ${process.env.SIGNUP_FETCH_TOKEN}`
        },
        credentials: "same-origin" // Send cookies (if any) only to the same origin, ensuring they are not leaked to third parties
    })
    .then(response => {
        if (response.status != 200) {
            throw new Error(`Request failed with status ${response.status} and body ${response.body}`);
        }
    })
    .catch(e => {
        error(e);
        (async () => {
            interaction.editReply({
                embeds: [signupformconnectionerror]
            });
        })();
    });
} catch (e) {
    // Catch synchronous errors
    error(e);
    await interaction.editReply({
         embeds: [signupformconnectionerror]
    });
}
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
