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
const { serverlerror, serverowner } = require("../embeds.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Setup Connect")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("partnership")
                .setDescription("Setup Partnership")
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription(
                            "The channel to send Request Partnership to.",
                        )
                        .setRequired(true),
                ),
        )
        .addSubcommand((subcommand) =>
            subcommand.setName("discovery").setDescription("Setup Discovery"),
        ),
    async execute(interaction) {
        await IsServerAndOwnerCheck(interaction);
        try {
            if (interaction.options.getSubcommand() === "partnership") {
                PartnershipSubCommand(interaction);
            }

            if (interaction.options.getSubcommand() === "discovery") {
                DiscoverySubCommand(interaction);
            }
        } catch (error) {
            error(error);
        }
    },
};

async function DiscoverySubCommand(interaction) {
    const response2 = await fetch(
        `${process.env.DATABASE_URL}${process.env.STORAGE_PATH}/servers/find/${interaction.guildId}`,
    ).then((response) => response.json());

    info(`Checking if server exists in database. ${response2.status}`);
    console.log(response2);

    if (response2.status != 404) {
        if (response2.server.Discoverable) {
            const serverexist = new EmbedBuilder()
                .setTitle("Server already Discoverable.")
                .setDescription(
                    `Your server "${interaction.guild.name}" is already in our database.\nYour server is also discoverable!`,
                )
                .setColor("#004898");

            await interaction.reply({
                embeds: [serverexist],
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
async function ChangingDiscoveryStatus(interaction) {
    const serverexist = new EmbedBuilder()
        .setTitle("Changing Discoverable Status")
        .setDescription(
            `Your server "${interaction.guild.name}" is already in our database.\nBut your server had Discoverablity disabled.\nWe have enabled this for you now!`,
        )
        .setColor("#004898");

    let response = await ChangeDiscoveryStatus(true, interaction);

    if (response.status == 200) {
        await interaction.reply({
            embeds: [serverexist],
        });
        return;
    }

    let embed = new EmbedBuilder(serverexist)
        .setDescription(
            `An error occured while changing the Discoverable status.`,
        )
        .setColor("#880808");

    await interaction.reply({
        embeds: [embed],
    });

    return;
}
async function IsServerAndOwnerCheck(interaction) {
    if (!interaction.guildId) {
        await interaction.reply({
            embeds: [serverlerror],
            ephemeral: true,
        });
        return;
    }
    if (interaction.member.id !== interaction.guild.ownerId) {
        await interaction.reply({
            embeds: [serverowner],
            ephemeral: true,
        });
        return;
    }
}
async function PartnershipSubCommand(interaction) {
    const channel = interaction.options.getChannel("channel");

    if (channel.type !== 0) {
        await interaction.reply("Please select a text channel.");
        return;
    }

    // THIS NEEDS TO BE AXIOS.GET THIS DOESNT WORK WITH FETCH FOR SOME REASON
    let old = await axios.get(
        `${process.env.DATABASE_URL}${process.env.STORAGE_PATH}/servers/find/${interaction.guildId}`,
    );

    if (old.status !== 200) {
        await interaction.reply({
            content:
                "An error occured, and I couldn't quite reach my database. Please try again later.",
            ephemeral: true,
        });
        return;
    }

    console.log(old.data);

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

    let embed = new EmbedBuilder()
        .setTitle("Setup Partnership")
        .setDescription(`PartnerShip Openner message sent to: ${channel}`);

    await interaction.reply({
        embeds: [embed],
        ephemeral: true,
    });
    return;
}
