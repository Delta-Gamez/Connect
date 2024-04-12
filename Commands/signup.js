const { Interaction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, SlashCommandBuilder } = require('discord.js');
const { info, warn, error, nolog } = require('../src/log.js');
const { signedin } = require('../embeds.js')
const axios = require('axios');
const config = require('../config.json');

/**
 * @param {Interaction} interaction
 */

module.exports = {
	data: new SlashCommandBuilder()
		.setName('signup')
		.setDescription('Create a Account on Connect.'),

        async execute(interaction) {
            const response = await axios.post(`${config['database-URL']}${config['storage-path']}/users/exist`, {
                DiscordID: interaction.member.id
            })

            info(`Checking if user exists in database. ${response.data.exists}`);
            
            
            if(response.data.exists) {
                await interaction.reply({
                    embeds: [signedin]
                });
                return;
            }

            const form = new ModalBuilder()
                .setCustomId('signup-submit')
                .setTitle('Create a Account on Connect.')

            const usernameInput = new TextInputBuilder()
                .setCustomId('signup-set-username')
                // NOTE: If you want to modify the Label below, we believe it needs to be under 50 characters. Any more, and it will throw an error.
                .setLabel(`What do you want your username to be?`)
                .setRequired(true)
                .setMinLength(4)
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Write your Username...')

            const passwordInput = new TextInputBuilder()
                .setCustomId('signup-set-password')
                // NOTE: If you want to modify the Label below, we believe it needs to be under 50 characters. Any more, and it will throw an error.
                .setLabel(`What do you want your password to be?`)
                .setRequired(true)
                .setMinLength(4)
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Write your Passwords...')

            const actionRow1 = new ActionRowBuilder().addComponents(usernameInput);
            const actionRow2 = new ActionRowBuilder().addComponents(passwordInput);
            form.addComponents(actionRow1, actionRow2);
            await interaction.showModal(form);
    }
};