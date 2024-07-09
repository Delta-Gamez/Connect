const { ModalBuilder, TextInputBuilder, StringSelectMenuBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const { messageButtonTimeout } = require('../embeds.js')

/*
 * @param required {CommandInteraction} interaction The interaction object it uses this to update other data for you
 * @param required {Array} [0] - Title of Modal, [1] - Title of Text Input
 * @param optional {Array} inputs - Array of inputs
 * @param optional {Number} limit - Limit of inputs
 * @returns {Promise} [interaction, inputs]
 */


async function askQuestion(interaction, question, inputs = [], limit) {
    return new Promise(async (resolve, reject) => {

        // Step 1: Create and send a modal to ask the user a question
        const modal = new ModalBuilder() // Create a new modal
            .setTitle(`${question[0]}`)
            .setCustomId('xuniqueIdForModal');

        const textInput = new TextInputBuilder() // Create a text input for the question
            .setCustomId('textInputCustomId')
            .setLabel(`${question[1]}`)
            .setStyle('Short')
            .setMaxLength(80)
            .setMinLength(5);


        const actionRow = new ActionRowBuilder().addComponents(textInput); // Add the text input to an action row

        // Add components to modal
        modal.addComponents(actionRow);

        // Show the modal to the user
        await interaction.showModal(modal);

        // Step 2: Listen for the modal submit interaction
        const filter = (i) => i.customId === 'xuniqueIdForModal';
        try {
            const modalInteraction = await interaction.awaitModalSubmit({ filter, time: 60_000 });
            
            // Get the user's input from the modal
            const userInput = modalInteraction.fields.getTextInputValue('textInputCustomId');
            inputs.push(userInput);

            if(limit && inputs.length >= limit) return resolve([interaction, inputs]);

            // Step 3: Present the user with a select menu to add more or finish
            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('selectMenuCustomId')
                .setPlaceholder('Choose an option')
                .addOptions([
                    {
                        label: 'Add More',
                        description: 'Select to add more information',
                        value: 'add_more',
                    },
                    {
                        label: 'That\'s it',
                        description: 'Select if you\'re done',
                        value: 'done',
                    },
                ]);

            const actionRow = new ActionRowBuilder().addComponents(selectMenu);

            // Send the select menu in a message

            const inputsNice = inputs.map((input, index) => `**${index+1}**: ${input}`).join('\n');
            const embed = new EmbedBuilder()
                .setTitle('Question')
                .setDescription(`Do you want to add more or are you done?\n${inputsNice}`);
                
            if(modalInteraction.message){
                await modalInteraction.update({ embeds: [embed], components: [actionRow] });
            } else {
                if(modalInteraction.replied) await modalInteraction.update({ embeds: [embed], components: [actionRow] });
                if(!modalInteraction.replied) await modalInteraction.reply({ embeds: [embed], components: [actionRow] });
            }

            // Step 4: Handle the user's selection
            const selectFilter = (i) => i.customId === 'selectMenuCustomId';
            const collector = modalInteraction.channel.createMessageComponentCollector({ filter: selectFilter, time: 15000 });

            collector.on('collect', async (selectInteraction) => {
                if (selectInteraction.values[0] === 'add_more') {
                    // If the user wants to add more, call askQuestion again
                    collector.stop();
                    resolve(await askQuestion(selectInteraction, question, inputs, limit)) 
                } else {
                    // If the user is done, process the information
                    resolve([selectInteraction, inputs]);
                }
            });

            collector.on('end', async (collected) => {
                if (collected.size === 0) {
                    await modalInteraction.editReply({ content: messageButtonTimeout, components: [], embeds: []});
                    reject('Confirmation not received within 60 seconds');
                }
            });
        } catch (error) {
            reject(error);
            await interaction.editReply({ content: messageButtonTimeout, components: [], embeds: []});
        }
    });
}



module.exports = askQuestion;