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
const {
    embedInfo,
    embedInfoError,
    embedInfoSuccess,
    embedConnect,
} = require("../embeds.js");
const axios = require("axios");
const { updateServer } = require("../utils/utils.js");
const { data } = require("./partnership.js");

module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName("connect")
        .setDescription("Setup Connect"),

    async execute(interaction) {
        if (!interaction.guildId) {
            await interaction.reply({
                embeds: [embedConnect.OutsideServer],
                ephemeral: true,
            });
            return;
        }
        if (interaction.member.id !== interaction.guild.ownerId) {
            await interaction.reply({
                embeds: [embedConnect.ServerOwner],
                ephemeral: true,
            });
            return;
        }
        let old
        try {
            old = await axios.get(
                `${process.env.DATABASE_URL}${process.env.STORAGE_PATH}/servers/find/${interaction.guildId}`,
                { timeout: 1000 } // Move the timeout configuration here
            );
        } catch (e) {
            await interaction.reply({
                embeds: [embedInfoError.ServerConnectionError],
                ephemeral: true,
                components: [],
            });
            return;
        }
        try {
            DiscoverySubCommand(old, interaction);
        } catch (error) {
            error(error);
        }
    },
};

async function ChangeConnect(status, interaction, old, reply) {
    const removedembed = new EmbedBuilder(embedInfo.Success)
        .setTitle("Connect")
        .setDescription(`Connect has been ${status ? "Enabled" : "Disabled"}`);
    
    if(reply) {
        if(!old.data.exists){
            await interaction.update({
                embeds: [removedembed],
                ephemeral: true,
                components: [],
            });
            return;
        }
    }

    if(!old.data.exists){
        return;
    }

    const invite = await interaction.channel.createInvite({
        maxUses: 0,
        maxAge: 0,
        unique: true,
    });

    data = {
        Connect: status,
        ServerInvite: String(invite.url),
    };

    let response = await updateServer(data, interaction)

    console.log(response)

    if(reply){
        await interaction.update({
            embeds: [removedembed],
            ephemeral: true,
            components: [],
        });
    }
}

// Main Screen (Enable or Disable)
async function DiscoverySubCommand(old, interaction) {
    const embedModulePartnership = new EmbedBuilder()
        .setTitle("Connect")
        .setDescription("Would you like to setup the Connect module?")
        .setColor("#004898");
    
    const Connect_Enable = new ButtonBuilder()
        .setCustomId("xconnect-enable")
        .setLabel("Enable")
        .setStyle(ButtonStyle.Primary);

    const Connect_Edit = new ButtonBuilder()
        .setCustomId("xconnect-edit")
        .setLabel("Edit")
        .setStyle(ButtonStyle.Primary);

    let row
    if(old.data.exists && old.data.server.Connect){
        const Connect_Disable = new ButtonBuilder()
            .setCustomId("xconnect-disable")
            .setLabel("Disable")
            .setStyle(ButtonStyle.Danger);

        row = new ActionRowBuilder().addComponents(Connect_Edit, Connect_Disable);
    } else {
        const Connect_Disable = new ButtonBuilder()
            .setCustomId("xconnect-disable")
            .setLabel("Disable")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true);

        row = new ActionRowBuilder().addComponents(Connect_Enable, Connect_Disable);
    }

    const response = await interaction.reply({
        embeds: [embedModulePartnership],
        components: [row],
        ephemeral: true,
    });

    const collectorFilter = i => i.user.id === interaction.user.id;
    try {
        const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
        if(confirmation.customId == 'xconnect-enable'){
            await StartDiscoveryModal(confirmation);
        } else if(confirmation.customId == 'xconnect-disable'){
            await ChangeConnect(false, confirmation, old, true);
        } else if(confirmation.customId == 'xconnect-edit'){
            await UpdateDiscoverModal(confirmation);
        }
    } catch (e) {
        if(e.size === 0){
            await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
        }
    }
}

// Sends the Modal to the user for extra informaton
async function UpdateDiscoverModal(interaction) {
    const form = new ModalBuilder()
        .setCustomId("addserver-submit")
        .setTitle("Change your community on our website.");

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