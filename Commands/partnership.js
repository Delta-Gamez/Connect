const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");
const { info, error } = require("../src/log.js");
const { embedInfoError, embedInfoSuccess } = require("../embeds.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("partnership")
        .setDescription("Setup Partnership")
        .addChannelOption((option) =>
            option
                .setName("channel")
                .setDescription("The channel to send Request Partnership to.")
                .setRequired(true),
        ),
    async execute(interaction) {
        await IsServerAndOwnerCheck(interaction);
        try {
            PartnershipSubCommand(interaction);
        } catch (error) {
            error(error);
        }
    },
};

// Checks that the user has permssions to run the command
async function IsServerAndOwnerCheck(interaction) {
    if (!interaction.guildId) {
        await interaction.reply({
            embeds: [embedInfoError.ServerError],
            ephemeral: true,
        });
        return;
    }
    if (interaction.member.id !== interaction.guild.ownerId) {
        await interaction.reply({
            embeds: [embedInfoError.ServerOwner],
            ephemeral: true,
        });
        return;
    }
}

async function PartnershipSubCommand(interaction) {
    const channel = interaction.options.getChannel("channel");

    if (channel.type !== 0) {
        const textchannelerror = new EmbedBuilder(embedInfoError.Template)
            .setTitle("Invalid Channel")
            .setDescription("Please select a text channel");
        await interaction.reply({ embeds: [textchannelerror] });
        return;
    }

    // THIS NEEDS TO BE AXIOS.GET THIS DOESNT WORK WITH FETCH FOR SOME REASON
    let old = await axios.get(
        `${process.env.DATABASE_URL}${process.env.STORAGE_PATH}/servers/find/${interaction.guildId}`,
    );

    if (old.status !== 200) {
        await interaction.reply({
            embeds: [embedInfoError.ServerConnectionError],
            ephemeral: true,
        });
        return;
    }

    if (old.data.status !== 200 || old.data.server.ShortDesc.length < 19) {
        StartPartnershipModal(interaction);
    } else {
        SendPartnerShipEmbed(interaction, channel);
    }
    // End of Partnership Setup
}
async function StartPartnershipModal(interaction) {
    const form = new ModalBuilder()
        .setCustomId("setup-partnership-submit")
        .setTitle("Setup your Server for Partnerships.");

    const descriptionInput = new TextInputBuilder()
        .setCustomId("setup-set-description")
        // NOTE: If you want to modify the Label below, we believe it needs to be under 50 characters. Any more, and it will throw an error.
        .setLabel(`Describe your server to us.`)
        .setRequired(true)
        .setMinLength(20)
        .setMaxLength(400)
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("Write your description...");

    const actionRow1 = new ActionRowBuilder().addComponents(descriptionInput);
    form.addComponents(actionRow1);
    await interaction.showModal(form);
    return;

    // Continues on Modals/setup.js
}
async function SendPartnerShipEmbed(interaction, channel) {
    let PartnerShipEmbed = new EmbedBuilder()
        .setTitle("Partnership")
        .setDescription("Press Open to request a partnership with this server.")
        .setColor("#004898");

    let button = new ButtonBuilder()
        .setCustomId("partnership-request")
        .setLabel("Open")
        .setStyle(ButtonStyle.Primary);

    let actionRow = new ActionRowBuilder().addComponents(button);

    await channel.send({
        embeds: [PartnerShipEmbed],
        components: [actionRow],
    });

    let embed = new EmbedBuilder(embedInfoSuccess.Template)
        .setTitle("Setup Partnership")
        .setDescription(`PartnerShip Openner message sent to: ${channel}`);

    await interaction.reply({
        embeds: [embed],
        ephemeral: true,
    });
    return;
}
