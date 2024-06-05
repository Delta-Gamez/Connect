const {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} = require("discord.js");
const { Client, Collection, Routes } = require("discord.js");
const { info, error } = require("../src/log.js");
const { stat } = require("fs");
const { rest } = require("../src/loader.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("manager")
        .setDescription("Staff Management Commands"),
    async execute(interaction) {
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
        try {
            ManagementCommand(interaction);
        } catch (error) {
            error(error);
        }
    },
};

async function ManagementCommand(interaction) {
    let old = await axios.get(
        `${process.env.DATABASE_URL}${process.env.STORAGE_PATH}/servers/find/${interaction.guildId}`,
    );

    const embedModuleStaffMangement = new EmbedBuilder()
        .setTitle("Staff Management")
        .setDescription("Would you like to setup the Staff Management module?")
        .setColor("#004898");

    const StaffMangement_Enable = new ButtonBuilder()
        .setCustomId("xStaffMan-enable")
        .setLabel("Enable")
        .setStyle(ButtonStyle.Primary);

    const StaffMangement_Edit = new ButtonBuilder()
        .setCustomId("xStaffMan-edit")
        .setLabel("Edit")
        .setStyle(ButtonStyle.Primary);

    let row;
    if (old.data.exists && old.data.server.StaffManagement) {
        const StaffMangement_Disable = new ButtonBuilder()
            .setCustomId("xStaffMan-disable")
            .setLabel("Disable")
            .setStyle(ButtonStyle.Danger);

        row = new ActionRowBuilder().addComponents(
            StaffMangement_Edit,
            StaffMangement_Disable,
        );
    } else {
        const StaffMangement_Disable = new ButtonBuilder()
            .setCustomId("xStaffMan-disable")
            .setLabel("Disable")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true);

        row = new ActionRowBuilder().addComponents(
            StaffMangement_Enable,
            StaffMangement_Disable,
        );
    }

    const response = await interaction.reply({
        embeds: [embedModuleStaffMangement],
        components: [row],
        ephemeral: true,
    });

    const collectorFilter = (i) => i.user.id === interaction.user.id;
    try {
        const confirmation = await response.awaitMessageComponent({
            filter: collectorFilter,
            time: 60_000,
        });
        if (confirmation.customId == "xStaffMan-enable") {
            // Enable the Module
            await ChangeManagement(true, confirmation, old, true);
        } else if (confirmation.customId == "xStaffMan-disable") {
            await ChangeManagement(false, confirmation, old, true);
            // Disable the Module
        } else if (confirmation.customId == "xStaffMan-edit") {
            // Edit the Module
        }
    } catch (e) {
        console.log(e);
        if (e.size === 0) {
            await interaction.editReply({
                content:
                    "Confirmation not received within 1 minute, cancelling",
                components: [],
            });
        }
    }
}

async function ChangeManagement(status, interaction, old, reply) {
    const removedembed = new EmbedBuilder()
        .setTitle("Staff Management")
        .setDescription(
            `Staff Management has been ${status ? "Enabled" : "Disabled"}`,
        );

    if (reply) {
        if (!old.data.exists) {
            await interaction.update({
                embeds: [removedembed],
                ephemeral: true,
                components: [],
            });
            return;
        }
    }

    if (!old.data.exists) {
        return;
    }

    data = {
        ServerID: interaction.guild.id,
        ServerName: interaction.guild.name,
        MemberCount: interaction.guild.memberCount,
        ServerIcon: interaction.guild.iconURL(),
        ServerBanner: interaction.guild.bannerURL(),
        ServerOwner: interaction.guild.ownerId,
        StaffManagement: status,
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

    if (status) {
        let commands = new Collection();

        // Load your command data, e.g., from a file
        const command = require(`../Commands/test.js`);

        // Add the command to the collection
        commands.set(command.data.name, command);

        // Convert the command data to JSON format required by Discord API
        const commandData = commands.map(command => command.data.toJSON());

        // Use PATCH to add the command to the guild
        await rest.put(
            Routes.applicationGuildCommands(interaction.client.user.id, interaction.guild.id),
            { body: commandData }
        );
    } else {
        const commands = await rest.get(
            Routes.applicationGuildCommands(interaction.client.user.id, interaction.guild.id)
        );

        // Find the command by name
        const command = commands.find(cmd => cmd.name === "test");

        // Check if the command exists
        if (!command) {
            console.log(`Command with name "${commandName}" not found.`);
            return;
        }

        // Delete the command by ID
        await rest.delete(
            Routes.applicationGuildCommand(interaction.client.user.id, interaction.guild.id, command.id)
        );

    }

    if (reply) {
        await interaction.update({
            embeds: [removedembed],
            ephemeral: true,
            components: [],
        });
    }
}
