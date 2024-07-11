const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { messageButtonTimeout } = require('../embeds');

/*
    * @param required {CommandInteraction} interaction The interaction object
    * @param required {MessageEmbed} embed The embed to be sent with the menu
    * @returns {Promise} A promise that resolves with [true, i] if the user selects yes, and [false, i] if the user selects no, where i is the interaction object
*/

async function YesNoOption(interaction, embed) {
    

    const yesButton = new ButtonBuilder()
    .setCustomId("xyes")
    .setLabel("Yes")
    .setStyle(ButtonStyle.Primary)

    const noButton = new ButtonBuilder()
    .setCustomId("xno")
    .setLabel("No")
    .setStyle(ButtonStyle.Danger)

    let row1 = new ActionRowBuilder().addComponents(yesButton, noButton);

    const response = await interaction.update({
        embeds: [embed],
        components: [row1],
        ephemeral: true,
    });

    const collectorFilter = i => i.user.id === interaction.user.id;

    const collector = interaction.channel.createMessageComponentCollector({ filter: collectorFilter, time: 60_000 });

    return new Promise((resolve, reject) => {
        collector.on('collect', async i => {
            if (i.customId === 'xno') {
                collector.stop();
                resolve([false, i]);
            } else if (i.customId === 'xyes'){
                collector.stop();
                resolve([true, i]);
            }
        });

        collector.on('end', async collected => {
            if (collected.size === 0) {
                await interaction.editReply({ content: messageButtonTimeout, components: [] });
                reject(messageButtonTimeout); 
            }
        });
    });
}

module.exports = YesNoOption;