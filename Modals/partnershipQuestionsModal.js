const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require("discord.js");
const { getServer } = require("../utils/utils.js");
const { embedPartnership } = require("../embeds.js");

module.exports = {
    data: {
        name: "partnershipQuestionsModal",
        customId: "partnershipQuestionsModal",
        description: "Process PartnerShip Questions.",
    },
    async execute(interaction) {
        const server = await getServer(interaction)
        if(!server) return;

        if(!server.server.PartnerShip){
            interaction.reply({embeds: [embedPartnership.RequestDisabled], ephemeral: true})
            return;
        }

        let questionsAnswers = [];
        let index = 0;
        for (const question of JSON.parse(server.server.PartnerShipQuestions)) {
            const answer = await interaction.fields.getTextInputValue(`question${index}`);
            questionsAnswers.push({ "question": question, "answer": answer });
            index++;
        }



        const description = interaction.message.embeds[0].data.description;

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

        const embed = await embedPartnership.RequestThread(serverData, questionsAnswers);
        
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

    }
};