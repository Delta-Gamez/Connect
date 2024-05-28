const { ChannelType, EmbedBuilder, ButtonBuilder } = require("discord.js");
const { embedInfoSuccess } = require("../embeds.js");

module.exports = {
    data: {
        customId: "partnership-request",
    },
    async execute(interaction) {
        console.log(interaction.message.embeds[0].data.description)
        const description = interaction.message.embeds[0].data.description

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
        thread.send({
            embeds: [embed],
        });
        
        const replyembed = new EmbedBuilder(embedInfoSuccess.Template)
            .setTitle(`PartnerShip Thread Created`)
            .setDescription(`https://discord.com/channels/${interaction.guild.id}/${thread.id}`)
        interaction.reply(
            { embeds: [replyembed], ephemeral: true }
        )
    },
};
