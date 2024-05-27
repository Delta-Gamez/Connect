module.exports = {
    data: {
        customId: "partnership-request",
    },
    async execute(interaction) {
        const thread = await interaction.channel.threads.create({
            name: `${interaction.user.id}: Partnership Request`,
            type: ChannelType.PrivateThread,
        });
        thread.members.add(interaction.user.id);
        thread.send({
            content: `This is your partnership request thread. Please describe what you had in mind, and we will get back to you as soon as possible.`,
        });
    },
};
