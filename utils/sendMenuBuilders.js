const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js')
const { messageButtonTimeout } = require('../embeds.js')

/*
    * @param required {CommandInteraction} interaction The interaction object
    * @param required {MessageComponent} component The component to be added to the action row
    * @param required {Boolean} If enabled there will have to be a selected {something} before the continue button is enabled
    * @param required {MessageEmbed} embed The embed to be sent with the menu
    * @param {Array} options The options for the select menu
    * @param {Bool} if on it will use interaction.send instead of .update
    * @returns {Promise} A promise that resolves with the selected channel
*/

async function sendMenuBuilders(interaction, component, requiremnet, embed, options, first) {
    let row1 = new ActionRowBuilder().addComponents(component);

    const continueButton = new ButtonBuilder()
    .setCustomId("xcontinue")
    .setLabel(">")
    .setStyle(ButtonStyle.Primary)
    .setDisabled(requiremnet);

    let row2 = new ActionRowBuilder().addComponents(continueButton);

    if(first){
        interaction.reply({
            embeds: [embed],
            components: [row1, row2],
            ephemeral: true,
        });
    } else {
        await interaction.update({
            embeds: [embed],
            components: [row1, row2],
            ephemeral: true,
        });
    }


    const collectorFilter = i => i.user.id === interaction.user.id;

    const collector = interaction.channel.createMessageComponentCollector({ filter: collectorFilter, time: 60_000 });

    let selectedChannel = null;

    return new Promise((resolve, reject) => {
        collector.on('collect', async i => {
            if (i.customId === 'xcontinue') {
                collector.stop();
                resolve([selectedChannel, i]); // Resolve the Promise with the selectedChannel
            } else {
                row2 = new ActionRowBuilder().addComponents(continueButton.setDisabled(false))
                if(!options){
                    selectedChannel = i.values;
                    await i.update({ components: [row1, row2] });
                } else {
                    if(!i.values){
                        reject('Mega Error');
                        return;
                    }
                    selectedChannel = i.values[0]
                    const updatedMemberRequirementOptions = options.map(option =>
                        option.data.value === i.values[0] 
                            ? { ...option.data, default: true } 
                            : option.data
                    );
        
                    row1 = new ActionRowBuilder().addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('xmember-requirements')
                            .setPlaceholder('Select a Member Requirement')
                            .addOptions(updatedMemberRequirementOptions)
                    );

                    await i.update({ components: [row1, row2] });
                }
            }
        });

        collector.on('end', async collected => {
            if (collected.size === 0) {
                await interaction.editReply({ content: messageButtonTimeout, components: [], embeds: []});
                reject('Confirmation not received within 1 minute'); // Reject the Promise if no confirmation was received
            }
        });
    });
}

module.exports = sendMenuBuilders;