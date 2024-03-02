const { Interaction } = require('discord.js');
const { info, warn, error, nolog } = require('../../../src/log.js');
const { time, timeStamp } = require('console');
const { TIME } = require('sequelize');

/**
 * @param {Interaction} interaction
 */
async function signup(interaction) {
    if (!(interaction.member.id && interaction.guild.ownerId && parseInt(interaction.member.id) === parseInt(interaction.guild.ownerId))) {
        await interaction.reply({
            content:`You are not the owner!`
        });
        return;
    }
    info('Modal Signup Submitted for Processing.');
    await interaction.reply({
        content: 'Thank you! Your form has been submitted and will now be processed.'
    });
    try {
        data = {
            guildId: interaction.guild.id,
            guildName: interaction.guild.name,
            guildIconURL: interaction.guild.iconURL(),
            guildBannerURL: interaction.guild.bannerURL(),
            shortDesc: String(interaction.fields.getTextInputValue('signup-set-description')),
            memberCount: interaction.guild.memberCount,
            guildInvite: interaction.guild.channels.cache.first().createInvite().then(invite => invite.url),
            signupDate: Date.now()
        }
    } catch (e) {
        error(`Error while creating server data: ${e}`);
        await interaction.editReply({
            content: 'Uh-oh! An error occurred while processing your form. This could be caused from missing data or incorrect permissions. Please try again later.'
        });
        return;
    }
    info(`A new server will be submitted for approval. The following server data will be sent:${JSON.stringify(data)}`);
    try {
        fetch('https://connect.deltagamez.ch/api/v1/', {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
    } catch (e) {
        error(e);
        await interaction.editReply({
            content: 'Uh-oh! An error occurred while sending your form to our servers. Try again in a few minutes.'
        })
    }
}

module.exports = {
    name: 'signup modal submit',
    customId: 'signup-submit',
    description: 'Process submitted signup modals.',
    async execute(interaction) {
        await signup(interaction);
    }
};
