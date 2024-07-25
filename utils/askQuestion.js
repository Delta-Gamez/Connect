const { ModalBuilder, TextInputBuilder, StringSelectMenuBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { messageButtonTimeout } = require('../embeds.js')

/*
 * @param required {CommandInteraction} interaction The interaction object it uses this to update other data for you
 * @param required {Array} [0] - Title of Modal, [1] - Title of Text Input
 * @param optional {Array} inputs - Array of inputs
 * @param optional {Number} limit - Limit of inputs
 * @returns {Promise} [interaction, inputs]
 */


async function askQuestion(interaction, question, inputs = [], limit, addRemoveEmbed, removeEmbeds, skip = false, type) {
    return new  Promise(async (resolve, reject) => {
        try{
            if(skip){
                await selectMenu(interaction, inputs, limit, question, removeEmbeds, addRemoveEmbed, resolve);
                return;
            }
    
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
                if(userInput.toLowerCase().includes('member') || userInput.toLowerCase().includes('members')){
                    type = 'member';
                }

                inputs.push([userInput, type]);
    
                await selectMenu(modalInteraction, inputs, limit, question, removeEmbeds, addRemoveEmbed, resolve, reject);
                
            } catch (error) {
                resolve('error');
                await interaction.editReply({ content: messageButtonTimeout, components: [], embeds: []});
            }
        } catch (error) {
            resolve('error');
            await interaction.editReply({ content: messageButtonTimeout, components: [], embeds: []});
        }
    });
}

async function selectMenu(interaction, inputs, limit, question, removeEmbeds, addRemoveEmbed, resolve, reject){
    // Step 3: Present the user with a select menu to add more or finish
    const options = []

    if(!(limit && inputs.length >= limit)){
        options.push(
            {
                label: `${inputs.length > 0 ? 'Add more' : 'Add'}`,
                description: 'Select to add more information',
                value: 'add_more_short',
            },
        )
    }

    if(inputs.length > 0){
        options.push({
            label: 'Remove',
            description: 'Select to remove an input',
            value: 'remove',
        },
        {
            label: 'That\'s it',
            description: 'Select if you\'re done',
            value: 'done',
        })
    }

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('selectMenuCustomId')
        .setPlaceholder('Choose an option')
        .addOptions(options);

    const actionRow = new ActionRowBuilder().addComponents(selectMenu);

    // Send the select menu in a message

    const embed = await addRemoveEmbed(inputs) 
        
    if(interaction.message){
        await interaction.update({ embeds: [embed], components: [actionRow] });
    } else {
        if(interaction.replied) await interaction.update({ embeds: [embed], components: [actionRow] });
        if(!interaction.replied) await interaction.reply({ embeds: [embed], components: [actionRow] });
    }

    // Step 4: Handle the user's selection
    const selectFilter = (i) => i.customId === 'selectMenuCustomId';
    const collector = interaction.channel.createMessageComponentCollector({ filter: selectFilter, time: 15000 });

    collector.on('collect', async (selectInteraction) => {
        await selectInteractione(collector, selectInteraction, removeEmbeds, addRemoveEmbed, inputs, limit, question, resolve);
    });

    collector.on('end', async (collected) => {
        if (collected.size === 0) {
            await interaction.editReply({ content: messageButtonTimeout, components: [], embeds: []});
            resolve('error');
        }
    });
}


async function selectInteractione(collecter, interaction, removeEmbeds, addRemoveEmbed, inputs, limit, question, resolve){
    switch (interaction.values[0]) {
        case 'add_more_short':
            // If the user wants to add more, call askQuestion again
            collecter.stop();
            resolve(await askQuestion(interaction, question, inputs, limit, addRemoveEmbed, removeEmbeds, false, 'short'));
            break;
        case 'add_more_long':
            // If the user wants to add more, call askQuestion again
            collecter.stop();
            resolve(await askQuestion(interaction, question, inputs, limit, addRemoveEmbed, removeEmbeds, false, 'long'));
            break;
        case 'add_member':
            collecter.stop();
            resolve(await askQuestion(interaction, question, inputs, limit, addRemoveEmbed, removeEmbeds, false, 'member'));
            break;
        case 'remove':
            collecter.stop();
            const removeSelectMenu = new StringSelectMenuBuilder()
                .setCustomId('removeSelectMenuCustomId')
                .setPlaceholder('Choose an option')
                .addOptions(
                    inputs.map((input, index) => ({
                        label: `${input[0]} (${input[1]})`,
                        value: index.toString(),
                    }))
                );

            const removeActionRow = new ActionRowBuilder().addComponents(removeSelectMenu);

            const backButton = new ButtonBuilder()
                .setCustomId('xback')
                .setLabel('Back')
                .setStyle('Secondary');
            
            const backButtonRow = new ActionRowBuilder().addComponents(backButton);

            const removeEmbed = await removeEmbeds(inputs);

            await interaction.update({ embeds: [removeEmbed], components: [removeActionRow, backButtonRow] });

            const removeFilter = (i) => i.customId === 'removeSelectMenuCustomId' || i.customId === 'xback';

            const removeCollector = interaction.channel.createMessageComponentCollector({ filter: removeFilter, time: 60_000 });

            removeCollector.on('collect', async (removeInteraction) => {
                if(removeInteraction.customId === 'xback'){
                    removeCollector.stop();
                    resolve(await askQuestion(removeInteraction, question, inputs, limit, addRemoveEmbed, removeEmbeds, true));
                } else {
                    const index = parseInt(removeInteraction.values[0]);
                    inputs.splice(index, 1);
                    removeCollector.stop();
                    resolve(await askQuestion(removeInteraction, question, inputs, limit, addRemoveEmbed, removeEmbeds, true));
                }
            });
            break;
        case 'done':
            // If the user is done, process the information
            resolve([interaction, inputs]);
            break;
        default:
            break;
    }
}



module.exports = askQuestion;