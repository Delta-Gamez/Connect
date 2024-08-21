const { ChannelType, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const { embedPartnership } = require("../embeds.js");
const { getServer } = require("../utils/utils.js");

module.exports = {
    data: {
        customId: "partnershiprequest",
    },
    async execute(interaction) {
        const server = await getServer(interaction)
        if(!server) return;

        if(!server.server.PartnerShip){
            interaction.reply({embeds: [embedPartnership.RequestDisabled], ephemeral: true})
            return;
        }

        const description = interaction.message.embeds[0].data.description;

        // Fetch active threads
        const threads = await interaction.channel.threads.fetchActive();

        // Check if there's a thread with a name that starts with the user's ID
        const existingThread = threads.threads.find(thread => thread.name.startsWith(`${interaction.user.id}:`));
    
        if (existingThread) {
            const embed = await embedPartnership.RequestPending(existingThread)
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }



        // Below needs moved into a modal
        if(!server.server.PartnerShipQuestions || server.server.PartnerShipQuestions.length === 0 || server.server.PartnerShipQuestions === 'null') {
            
            // Split the description at ": "
            const parts = description.split(": ");
            let role = null;
            if(parts[parts.length - 1].startsWith("<@")) {
                role = parts[parts.length - 1];
            }

            const thread = await interaction.channel.threads.create({
                name: `${interaction.user.id}: Partnership Request`,
                type: ChannelType.PrivateThread,
            });

            thread.members.add(interaction.user.id);
            const serverData = await getServer(interaction);

            const embed = await embedPartnership.RequestThread(serverData);
            
            let approve = new ButtonBuilder()
                .setCustomId("partnershipaccept")
                .setLabel("Approve")
                .setStyle(ButtonStyle.Success);

            let decline = new ButtonBuilder()
                .setCustomId("partnershipdecline")
                .setLabel("Decline")
                .setStyle(ButtonStyle.Danger);

            const row = new ActionRowBuilder()
                .addComponents(approve, decline);
            
            if (role) {
                thread.send({
                    content: `${role}`,
                    embeds: [embed],
                    components: [row] 
                });
            } else {
                thread.send({
                    embeds: [embed],
                    components: [row] 
                });
            }



            const replyEmbed = await embedPartnership.RequestSuccess(`https://discord.com/channels/${interaction.guild.id}/${thread.id}`)
            
            if(!interaction.replied && !interaction.deferred) {
                interaction.reply({ 
                    embeds: [replyEmbed], 
                    ephemeral: true
                });
            }

            return;
        }

        let questions = server.server.PartnerShipQuestions;
        questions = JSON.parse(questions);

        await createAndShowModal(interaction, questions);
    },
};

async function createAndShowModal(interaction, questions) {
    // Create a modal
    const modal = new ModalBuilder()
        .setCustomId('partnershipQuestionsModal')
        .setTitle('Partnership Application');

    // For each question, create a text input and add it to the modal
    questions.forEach((question, index) => {
        let textInput;
        if(question[1] === 'long'){
            textInput = new TextInputBuilder()
                .setCustomId(`question${index}`)
                .setLabel(question[0])
                .setStyle(TextInputStyle.Paragraph)
        } else {
            textInput = new TextInputBuilder()
                .setCustomId(`question${index}`)
                .setLabel(question[0])
                .setStyle(TextInputStyle.Short);
        }

        const actionRow = new ActionRowBuilder().addComponents(textInput);

        modal.addComponents(actionRow);
    });

    // Show the modal to the user
    await interaction.showModal(modal);
}