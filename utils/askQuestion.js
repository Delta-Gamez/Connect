const { ModalBuilder, TextInputBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const { messageButtonTimeout } = require('../embeds.js')

async function askQuestion(interaction, question, inputs = []) {
    return new Promise(async (resolve, reject) => {
        // Step 1: Create and send a modal to ask the user a question
        const modal = new ModalBuilder() // Create a new modal
            .setTitle(`Question: ${question}`)
            .setCustomId('xuniqueIdForModal');

        const textInput = new TextInputBuilder() // Create a text input for the question
            .setCustomId('textInputCustomId')
            .setLabel('Type your answer here')
            .setStyle('Short'); // SHORT for single-line input, PARAGRAPH for multi-line

        const actionRow = new ActionRowBuilder().addComponents(textInput); // Add the text input to an action row

        // Add components to modal
        modal.addComponents(actionRow);

        // Show the modal to the user
        await interaction.showModal(modal);

        // Step 2: Listen for the modal submit interaction
        const filter = (i) => i.customId === 'xuniqueIdForModal';
        try {
            const modalInteraction = await interaction.awaitModalSubmit({ filter, time: 15000 });
            
            // Get the user's input from the modal
            const userInput = modalInteraction.fields.getTextInputValue('textInputCustomId');
            inputs.push(userInput);

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
            if(modalInteraction.replied) await modalInteraction.update({ content: `Do you want to add more or are you done? ${inputs}`, components: [actionRow] });
            if(!modalInteraction.replied) await modalInteraction.reply({ content: `Do you want to add more or are you done? ${inputs}`, components: [actionRow] });

            // Step 4: Handle the user's selection
            const selectFilter = (i) => i.customId === 'selectMenuCustomId';
            const collector = modalInteraction.channel.createMessageComponentCollector({ filter: selectFilter, time: 15000 });

            collector.on('collect', async (selectInteraction) => {
                if (selectInteraction.values[0] === 'add_more') {
                    // If the user wants to add more, call askQuestion again
                    collector.stop();
                    resolve(await askQuestion(selectInteraction, question, inputs)) 
                } else {
                    // If the user is done, process the information
                    await selectInteraction.update({ content: 'Thank you for your input!', components: [] });
                    console.log('Question:', question);
                    console.log('Inputs:', inputs);
                    resolve(inputs);
                }
            });

            collector.on('end', async (collected) => {
                if (collected.size === 0) {
                    await modalInteraction.editReply({ content: 'No response received in time.', components: [] });
                }
            });
        } catch (error) {
            if (error.code === 'INTERACTION_COLLECTOR_ERROR') {
                await interaction.followUp({ content: 'No response received in time.', ephemeral: true });
            } else if (error.code === 40060) {
                reject('Interaction has already been acknowledged.');

            } else {
                reject(error);
            }
        }
    });
}



module.exports = askQuestion;