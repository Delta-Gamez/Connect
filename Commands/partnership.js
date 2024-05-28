const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    RoleSelectMenuBuilder
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
        )
        .addRoleOption((option) =>
            option
                .setName("role")
                .setDescription(
                    "The Role to mention when the Partnership is requested.",
                ),
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
        SendPartnerShipEmbed(interaction);
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
async function SendPartnerShipEmbed(interaction) {
    const select = new ChannelSelectMenuBuilder()
        .setCustomId("channels")
        .setPlaceholder("Pick a Channel")
        .setChannelTypes(0);

    const row = new ActionRowBuilder().addComponents(select);
    const pickAChannelEmbed = new EmbedBuilder().setTitle(`Pick a Channel`);
    const response  = await interaction.reply({
        embeds: [pickAChannelEmbed],
        components: [row],
        ephemeral: true,
    });

    const collectorFilter = i => i.user.id === interaction.user.id;

    try {
        const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
        console.log(confirmation.values[0])
        roleSelect(confirmation, confirmation.values[0])
    } catch (e) {
        await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
    }
}

async function roleSelect(interaction, channelid) {
    const select = new RoleSelectMenuBuilder()
        .setCustomId("roles")
        .setPlaceholder("Pick a Role")

    const xButton = new ButtonBuilder()
        .setCustomId('cancel')
        .setLabel('X')
        .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(select);
    const buttonrow = new ActionRowBuilder().addComponents(xButton);
    const pickAChannelEmbed = new EmbedBuilder().setTitle(`Pick a Role or use the X for "No Role"`);
    const response  = await interaction.update({
        embeds: [pickAChannelEmbed],
        components: [row, buttonrow],
        ephemeral: true,
    });

    const collectorFilter = i => i.user.id === interaction.user.id;

    try {
        const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
        if(confirmation.customID == 'pcancel'){
            return;
        } else [
            console.log(confirmation.values[0])
        ]
    } catch (e) {
        await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
    }
} 

async function SendEmbededMessage(interaction, channel){
    const role = interaction.options.getRole("role");
    let PartnerShipEmbed;
    if (role) {
        PartnerShipEmbed = new EmbedBuilder()
            .setTitle("Partnership")
            .setDescription(
                `Press Open to request a partnership with this server.\nThis would ping the role : <@&${role.id}>`,
            )
            .setColor("#004898");
    } else {
        PartnerShipEmbed = new EmbedBuilder()
            .setTitle("Partnership")
            .setDescription(
                "Press Open to request a partnership with this server.",
            )
            .setColor("#004898");
    }

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