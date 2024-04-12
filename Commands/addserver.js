const { Interaction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { info, warn, error, nolog } = require('../src/log.js');
const { servererror, serverowner, notsignedin } = require('../embeds.js')
const axios = require('axios');
const config = require('../config.json');

/**
 * @param {Interaction} interaction
 */

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addserver')
		.setDescription('Add your server to Connect.'),

        async execute(interaction) {

            if(!interaction.guildId) {
                await interaction.reply({
                    embeds: [servererror]
                });
                return;
            }
            if (!(interaction.member.id && interaction.guild.ownerId && parseInt(interaction.member.id) === parseInt(interaction.guild.ownerId))) {
                await interaction.reply({
                    embeds: [serverowner]
                });
                return;
            }

            const response = await axios.post(`${config['database-URL']}${config['storage-path']}/users/exist`, {
                DiscordID: interaction.member.id
            })

            info(`Checking if user exists in database. ${response.data.exists}`);
            
            
            if(!response.data.exists) {
                await interaction.reply({
                    embeds: [notsignedin]
                });
                return;
            }

            const response2 = await axios.get(`${config['database-URL']}${config['storage-path']}/servers/${interaction.guildId}`)

            info(`Checking if server exists in database. ${response2.data.exists}`);

            if(response2.data.exists) {
                const serverexist = new EmbedBuilder()
                    .setTitle('Server already exists.')
                    .setDescription(`Your server "${interaction.guild.name}" is already in our database.`)
                    .setColor('#880808')

                await interaction.reply({
                    embeds: [serverexist]
                });
                return;
            }

            info(`Owner used addserver command.`);
            const form = new ModalBuilder()
                .setCustomId('addserver-submit')
                .setTitle('Add your community on our website.')

            const descriptionInput = new TextInputBuilder()
                .setCustomId('addserver-set-description')
                // NOTE: If you want to modify the Label below, we believe it needs to be under 50 characters. Any more, and it will throw an error.
                .setLabel(`Describe your server to us.`)
                .setRequired(true)
                .setMinLength(20)
                .setMaxLength(400)
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder('Write your description...')

            const actionRow1 = new ActionRowBuilder().addComponents(descriptionInput);
            form.addComponents(actionRow1);
            await interaction.showModal(form);
    }
};