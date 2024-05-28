const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    SlashCommandBuilder,
    EmbedBuilder,
} = require("discord.js");
const { info, error } = require("../src/log.js");
const {
    embedInfoError,
    embedInfoSuccess,
} = require("../embeds.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("connect")
        .setDescription("Setup Connect"),

    async execute(interaction) {
        await IsServerAndOwnerCheck(interaction);
        try {
            DiscoverySubCommand(interaction);
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

// Gets the servers data, and returns if already "discoverable"
async function DiscoverySubCommand(interaction) {
    const response2 = await fetch(
        `${process.env.DATABASE_URL}${process.env.STORAGE_PATH}/servers/find/${interaction.guildId}`,
    ).then((response) => response.json());

    info(`Checking if server exists in database. ${response2.status}`);

    if (response2.status != 404) {
        if (response2.server.Discoverable) {
            const _serverexist = new EmbedBuilder(embedInfoError.Template)
                .setTitle("Connect is already setup.")
                .setDescription(
                    `Your server "${interaction.guild.name}" is already in our database.\n
                    Your server is also discoverable!`,
                );

            await interaction.reply({
                embeds: [_serverexist],
            });
            return;
        } else {
            ChangingDiscoveryStatus(interaction);
        }
    } else {
        info(`Owner used addserver command.`);
        StartDiscoveryModal(interaction);
    }
}

// Sends the Modal to the user for extra informaton
async function StartDiscoveryModal(interaction) {
    const form = new ModalBuilder()
        .setCustomId("addserver-submit")
        .setTitle("Add your community on our website.");

    const descriptionInput = new TextInputBuilder()
        .setCustomId("addserver-set-description")
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
}

// Sends a Embed to the user explaining how it enabled Discoverablity
async function ChangingDiscoveryStatus(interaction) {
    const _changeingdiscovery = new EmbedBuilder(embedInfoSuccess.Template)
        .setTitle("Changing Discoverable Status")
        .setDescription(
            `Your server "${interaction.guild.name}" is already in our database.\n
            But your server had Discoverablity disabled.\n
            We have enabled this for you now!`,
        );

    let response = await ChangeDiscoveryStatus(true, interaction);

    if (response.status == 200) {
        await interaction.reply({
            embeds: [_changeingdiscovery],
        });
        return;
    }

    const discoverablestatuserror = new EmbedBuilder(embedInfoError.Template)
        .setTitle(`Server Error`)
        .setDescription(
            `An error occured while changing the Discoverable status.`,
        );
    await interaction.reply({
        embeds: [discoverablestatuserror],
    });

    return;
}

// Changes the Discovery Status on the database
async function ChangeDiscoveryStatus(value, interaction) {
    const invite = await interaction.channel.createInvite({
        maxUses: 0,
        maxAge: 0,
        unique: true,
    });
    let data = {
        ServerID: interaction.guildId,
        ServerInvite: invite.url,
        ServerName: interaction.guild.name,
        MemberCount: interaction.guild.memberCount,
        ServerIcon: interaction.guild.iconURL(),
        ServerBanner: interaction.guild.bannerURL(),
        ServerOwner: interaction.guild.ownerId,
        Discoverable: value,
    };

    let response = await axios.put(
        `${process.env.DATABASE_URL}${process.env.STORAGE_PATH}/servers`,
        data,
        {
            headers: {
                Authorization: `${process.env.DATABASE_TOKEN}`,
            },
            withCredentials: true,
        },
    );

    return response;
}
