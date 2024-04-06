const { Interaction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const { info, warn, error, nolog } = require('../../../src/log.js');
/**
 * @param {Interaction} interaction
 */
async function signup(interaction) {
    if(!interaction.guildId) {
        await interaction.reply({
            content:`This command can only be used in a server.`
        });
        return;
    }
    if (!(interaction.member.id && interaction.guild.ownerId && parseInt(interaction.member.id) === parseInt(interaction.guild.ownerId))) {
        await interaction.reply({
            content:`The server owner must use this command.`
        });
        return;
    }
    info(`Owner used signup command.`);
    const form = new ModalBuilder()
        .setCustomId('signup-submit')
        .setTitle('Sign up your community on our website.')
    const descriptionInput = new TextInputBuilder()
        .setCustomId('signup-set-description')
        .setLabel(`Write a short description about your server shown to everyone.`)
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
    description: 'Sign up your server on Connect.',
    async execute(interaction) {
        await signup(interaction);
    }
}
