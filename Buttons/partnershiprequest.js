const { ChannelType, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { embedInfoSuccess, embedPartnership } = require("../embeds.js");

module.exports = {
    data: {
        customId: "partnershiprequest",
    },
    async execute(interaction) {
        const description = interaction.message.embeds[0].data.description;

        // Fetch active threads
        const threads = await interaction.channel.threads.fetchActive();

        // Check if there's a thread with a name that starts with the user's ID
        const existingThread = threads.threads.find(thread => thread.name.startsWith(`${interaction.user.id}:`));
    
        if (existingThread) {
            const embed = await embedPartnership.threadOpened(existingThread)
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

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
        
        const embed = embedPartnership.threadOpener;
        
        let approve = new ButtonBuilder()
            .setCustomId("partnershipaccept")
            .setLabel("Approve")
            .setStyle(ButtonStyle.Primary);

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



        const replyEmbed = await embedPartnership.threadOpen(`https://discord.com/channels/${interaction.guild.id}/${thread.id}`)
        
        interaction.reply({ 
            embeds: [replyEmbed], 
            ephemeral: true
        });
    },
};