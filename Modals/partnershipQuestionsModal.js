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
            questionsAnswers.push({ "question": question[0], "answer": answer });
            index++;
        }



        let role = null;
        let memberRequirement = 0;

        if(interaction.message.embeds[0].data.fields.length !== 0) {
            const parts = interaction.message.embeds[0].data.fields[0].value.split("\n");

            parts.forEach(part => {
                if (part.includes("**MINIMUM MEMBERS**:")) {
                    // Extracting memberRequirement directly
                    let tempRequirement = part.split("**MINIMUM MEMBERS**:")[1].trim();
                    if(tempRequirement) {
                        const matches = tempRequirement.match(/\d+/);
                        if (matches) {
                            memberRequirement = matches[0]; // This will be '100' if the string is '100+ Members'
                        }
                    }
                } else if (part.includes("**PARTNERSHIP HANDLER**:")) {
                    // Extracting roleMention directly
                    let tempRoleMention = part.split("**PARTNERSHIP HANDLER**:")[1].trim();
                    if(tempRoleMention.startsWith("<@")) {
                        role = tempRoleMention;
                    }
                }
            });

            let memberQuestion = false;
            let memberQuestionID = 0
            for ( const question of JSON.parse(server.server.PartnerShipQuestions)) {
                if (question[1] == 'member') {
                    memberQuestion = memberQuestionID
                    break;
                }
                memberQuestionID++;
            }


            if (memberQuestion !== false) {
                // Use a regular expression to find numbers in the string
                const matches = questionsAnswers[memberQuestion].answer.match(/\d+/);
                // Check if there was at least one match
                if (matches) {
                    const number = parseInt(matches[0], 10); // Convert the first match to a number
                    if (number < memberRequirement) {
                        await interaction.reply({embeds: [embedPartnership.NotEnoughMembers], ephemeral: true});
                        return;
                    }
                }
            }
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