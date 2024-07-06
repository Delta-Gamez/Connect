const {
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder } = require("discord.js");
const axios = require("axios");
const getServer = require("./getServer.js");
const { messageButtonTimeout } = require("../embeds.js");

/*
 * @param required {CommandInteraction} interaction The interaction object
 * @param required {moduleName} The Module to Enable/Disable/Edit
 * @param {DBName} If specified it will check this value in the DB instead of the moduleName
 * @returns {Promise} [0] - Interaction, [1] int - 1 for Enable, 2 for Edit, 3 for Disable
 */

async function enableDisablePrompt(interaction, moduleName, DBName) {
    DBName = DBName ?? moduleName;

    let old = await getServer(interaction)

    const embedModuleStaffMangement = new EmbedBuilder()
        .setTitle(moduleName)
        .setDescription(`Would you like to setup the ${moduleName} module?`)
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
    if (old.exists && old.server[DBName]) {
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

    await interaction.reply({
        embeds: [embedModuleStaffMangement],
        components: [row],
        ephemeral: true,
    });

    const collectorFilter = i => i.user.id === interaction.user.id;

    const collector = interaction.channel.createMessageComponentCollector({ filter: collectorFilter, time: 60_000 });

    return new Promise((resolve, reject) => {
        collector.on('collect', async i => {

            if (i.customId == "xStaffMan-enable") {
                // Enable the Module
                resolve([i, 1])
            } else if (i.customId == "xStaffMan-disable") {
                // Disable the Module
                resolve([i, 3])
            } else if (i.customId == "xStaffMan-edit") {
                resolve([i, 2])
            }
        });

        collector.on('end', async collected => {
            if (collected.size === 0) {
                await interaction.editReply({ content: messageButtonTimeout, components: [] });
                reject('Confirmation not received within 1 minute'); // Reject the Promise if no confirmation was received
            }
        });
    });
}

module.exports = enableDisablePrompt;
