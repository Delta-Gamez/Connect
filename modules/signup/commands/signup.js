const { Interaction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const { info, warn, error, nolog } = require('../../../src/log.js');
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
    info(`Owner used signup command.`);
    const form = new ModalBuilder()
        .setCustomId('signup-submit')
        .setTitle('Sign up on our website!')
    const descriptionInput = new TextInputBuilder()
        .setCustomId('signup-set-description')
        .setLabel('Write a short description about your server.')
        .setRequired(true)
        .setMinLength(20)
        .setMaxLength(400)
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder('Write your description...')
    const actionRow1 = new ActionRowBuilder().addComponents(descriptionInput);
    form.addComponents(actionRow1);
    await interaction.showModal(form);
}

module.exports = {
    name: 'signup',
    description: 'Sign up your server on our website!',
    async execute(interaction) {
        await signup(interaction);
    }
}
