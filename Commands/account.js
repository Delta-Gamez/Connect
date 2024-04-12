const { Interaction, EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { info, warn, error, nolog } = require('../src/log.js');
const { signedin, notsignedin } = require('../embeds.js')
const axios = require('axios');
const config = require('../config.json');


/**
 * @param {Interaction} interaction
 */

module.exports = {
	data: new SlashCommandBuilder()
		.setName('account')
		.setDescription('Get your Connect Account information'),

        async execute(interaction) {
            const response = await axios.post(`${config['database-URL']}${config['storage-path']}/users`, {
                DiscordID: interaction.member.id,
            }, {
                headers: {
                    "Authorization": `${config['database-token']}`
                },
                withCredentials: true
            })

            if(response.status == 404) {
                await interaction.reply({
                    embeds: [notsignedin]
                });
                return;
            }

            const userembed = new EmbedBuilder()
                .setTitle('Your Connect Account Information')
                .setDescription(`Username: ${response.data.user.Username}\n${response.data.user.Email ? `Email: ${response.data.user.Email}\n` : ``}Level: ${response.data.user.Level}`)
                .setColor('#004898')
            
            await interaction.reply({
                embeds: [userembed]
            });
    }
};