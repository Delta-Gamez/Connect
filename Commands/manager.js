const {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    RoleSelectMenuBuilder,
} = require("discord.js");
const { embedConnect } = require("../embeds.js");
const { info, warn, error } = require("../src/log.js");
const { rest, load } = require("../src/loader.js");
const sendMenuBuilders = require("../utils/sendMenuBuilders.js");
const YesNoOption = require("../utils/YesNoOption.js");
const UpdateDatabase = require("../utils/updateDatabase.js");
const enableCommandForGuild = require("../utils/enableCommandForGuild.js");
const disableCommandForGuild = require("../utils/disableCommandForGuild.js");
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
        } catch (e) {
            error(e);
        }
    },
};

async function ManagementCommand(interaction) {
    let old;
    try {
        old = await axios.get(
            `${process.env.DATABASE_URL}${process.env.STORAGE_PATH}/servers/find/${interaction.guildId}`,
        );
    } catch (e) {
        await interaction.reply({
            embeds: [embedConnect.ErrorDatabase],
            ephemeral: true,
            components: [],
        });
        return;
    }


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
            StaffManagementCommande(old, confirmation);
        } else if (confirmation.customId == "xStaffMan-disable") {
            // Disable the Module
            await ChangeManagement(false, confirmation, old, true);
        } else if (confirmation.customId == "xStaffMan-edit") {
            StaffManagementCommande(old, confirmation);
        }
    } catch (e) {
        if(e.size === 0){
            await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
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

    if (!status) {
        await disableCommandForGuild(interaction, "loa");
    }

    if (reply) {
        await interaction.update({
            embeds: [removedembed],
            ephemeral: true,
            components: [],
        });
    }
}

async function StaffManagementCommande(old, interaction) {
    if (old.data.status != 200) {
        await StartStaffManagement(interaction);
    } else {
        await SendStaffManagementQuestionsEmbeds(interaction);
    }
}

async function SendStaffManagementQuestionsEmbeds(interaction) {

    const selectManagementRoles = new RoleSelectMenuBuilder()
    .setCustomId("manmention")
    .setPlaceholder("Select Management Roles")
    .setMinValues(1)
    .setMaxValues(5);

    const selectembed = new EmbedBuilder()
    .setTitle("Select Management Roles");

    let ManRoles = await sendMenuBuilders(interaction, selectManagementRoles, true, selectembed);
    interaction = ManRoles[1];
    ManRoles = ManRoles[0];
    let rolesManText = []
    for (let i = 0; i < ManRoles.length; i++) {
        rolesManText.push(ManRoles[i].id);
    }

    const selectModeraterRoles = new RoleSelectMenuBuilder()
    .setCustomId("modmention")
    .setPlaceholder("Select Moderater Roles")
    .setMinValues(1)
    .setMaxValues(5);

    const roleembed = new EmbedBuilder()
    .setTitle("Select Moderater Roles");

    let roles = await sendMenuBuilders(interaction, selectModeraterRoles, true, roleembed);
    interaction = roles[1];
    roles = roles[0];
    let rolesModText = []
    for (let i = 0; i < roles.length; i++) {
        rolesModText.push(roles[i].id);
    }

    let loaembed = new EmbedBuilder().setTitle("Would you like to Enable LOA (/loa)?")
    let loa = await YesNoOption(interaction, loaembed);
    interaction = loa[1];
    loa = loa[0];

    await UpdateDatabaseData(interaction, rolesManText, rolesModText, loa)
}

async function UpdateDatabaseData(interaction, rolesManText, rolesModText, loa) {
    data = {
        ServerID: interaction.guild.id,
        ServerName: interaction.guild.name,
        MemberCount: interaction.guild.memberCount,
        ServerIcon: interaction.guild.iconURL(),
        ServerBanner: interaction.guild.bannerURL(),
        ServerOwner: interaction.guild.ownerId,
        StaffManagement: true,
        StaffManagementRoles: JSON.stringify(rolesManText),
        StaffModeraterRoles: JSON.stringify(rolesModText),
    };

    const response = await UpdateDatabase(data);

    if(loa){
        await enableCommandForGuild(interaction, "loa");
    }

    if(response.data.status == 200){
        const removedembed = new EmbedBuilder()
        .setTitle("Staff Management")
        .setDescription("Staff Management has been Enabled");

        await interaction.update({
            embeds: [removedembed],
            ephemeral: true,
            components: [],
        });
    } else {
        await interaction.update({
            embeds: [embedConnect.ErrorDatabase],
            ephemeral: true,
            components: [],
        });
    }
}

async function StartStaffManagement(interaction) {
    data = {
        ServerID: interaction.guild.id,
        ServerName: interaction.guild.name,
        MemberCount: interaction.guild.memberCount,
        ServerIcon: interaction.guild.iconURL(),
        ServerBanner: interaction.guild.bannerURL(),
        ServerOwner: interaction.guild.ownerId,
    };

    const response = await axios.post(
        `${process.env.DATABASE_URL}${process.env.STORAGE_PATH}/servers`,
        data,
        {
            headers: {
                Authorization: `${process.env.DATABASE_TOKEN}`,
            },
            withCredentials: true,
        },
    );

    if(response.data.status == 200){
        StaffManagementCommande(response, interaction);
    }
}
