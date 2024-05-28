const { ChannelType, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { embedInfoSuccess } = require("../embeds.js");

module.exports = {
    data: {
        customId: "partnership-request",
    },
    async execute(interaction) {
        const description = interaction.message.embeds[0].data.description;

        // Split the description at ": "
        const parts = description.split(": ");
        const role = parts[1];

        const thread = await interaction.channel.threads.create({
            name: `${interaction.user.id}: Partnership Request`,
            type: ChannelType.PrivateThread,
        });
        thread.members.add(interaction.user.id);
        const embed = new EmbedBuilder(embedInfoSuccess.Template)
            .setTitle(`Partnership Request`)
            .setDescription(
                `This is your partnership request thread. Please describe what you had in mind, and we will get back to you as soon as possible.`,
            );
        
        let approve = new ButtonBuilder()
            .setCustomId("partnership-accept")
            .setLabel("Approve")
            .setStyle(ButtonStyle.Primary);

        let decline = new ButtonBuilder()
            .setCustomId("partnership-decline")
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



        const replyEmbed = new EmbedBuilder(embedInfoSuccess.Template)
            .setTitle(`PartnerShip Thread Created`)
            .setDescription(
                `https://discord.com/channels/${interaction.guild.id}/${thread.id}`,
            );
        interaction.reply({ 
            embeds: [replyEmbed], 
            ephemeral: true
        });
    },
};
