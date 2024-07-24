const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ChannelSelectMenuBuilder } = require("discord.js");
const { embedSuggestion } = require('../embeds.js')
const { getServer, sendMenuBuilders, updateorCreateServer } = require("../utils/utils.js");

module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName("suggestions")
        .setDescription("Suggestions Module."),
    async execute(interaction) {
        let old = await getServer(interaction)

        try{
            let old = await getServer(interaction)
        } catch (e) {
            return;
        }

        if(!old){
            return;
        }

        const embedModuleSuggestions = await embedSuggestion.ModuleInfo(old.exists && old.server.Suggestions, old.server)
    
        const StaffMangement_Enable = new ButtonBuilder()
            .setCustomId("xSuggestions-enable")
            .setLabel("Enable")
            .setStyle(ButtonStyle.Primary);
    
        const StaffMangement_Edit = new ButtonBuilder()
            .setCustomId("xSuggestions-edit")
            .setLabel("Edit")
            .setStyle(ButtonStyle.Primary);
    
        let row;

        let StaffMangement_Disable = new ButtonBuilder()
            .setCustomId("xSuggestions-disable")
            .setLabel("Disable")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(false);

        if (old.exists && old.server.Suggestions) {
            row = new ActionRowBuilder().addComponents(
                StaffMangement_Edit,
                StaffMangement_Disable,
            );
        } else {
            StaffMangement_Disable.setDisabled(true);

            row = new ActionRowBuilder().addComponents(
                StaffMangement_Enable,
                StaffMangement_Disable,
            );
        }
    
        await interaction.reply({
            embeds: [embedModuleSuggestions],
            components: [row],
            ephemeral: true,
        });
    
        const collectorFilter = i => i.user.id === interaction.user.id;
    
        const collector = interaction.channel.createMessageComponentCollector({ filter: collectorFilter, time: 60_000 });
    
        collector.on('collect', async i => {
            collector.stop();
            if (i.customId == "xSuggestions-enable") {
                await EnableEdit(i, old, false)
            } else if (i.customId == "xSuggestions-disable") {
                await enableDisableEdit(i, 1, null)
            } else if (i.customId == "xSuggestions-edit") {
                await EnableEdit(i, old, true)
            }
        });

        collector.on('end', async collected => {
            if (collected.size === 0) {
                await interaction.editReply({ content: messageButtonTimeout, components: [] });
                reject(messageButtonTimeout); // Reject the Promise if no confirmation was received
            }
        });
    },
};

async function EnableEdit(interaction, server, edit) {
    const embed = await embedSuggestion.askForChannel(server.server, edit);

    const channelSelect = new ChannelSelectMenuBuilder()
        .setCustomId("xSuggestions-channel")
        .setPlaceholder("Select a Channel")
        .setMinValues(1)
        .setMaxValues(1)
        .setChannelTypes([15, 0]);

    let channel = await sendMenuBuilders(interaction, channelSelect, true, embed);

    interaction = channel[1];
    channel = channel[0][0];

    await enableDisableEdit(interaction, edit ? 2 : 0, channel);
}

/*
    Enable/Disable the Suggestions Module
    @param interaction: The interaction object
    @param server: The server object
    @param enable: Enable or Disable the module (0 - Enable, 1 - Disable, 2 - Edit)
    @param channel: The channel to send suggestions to
*/

async function enableDisableEdit(interaction, status, channel) {
    let enable = status == 1 ? false : true;
    let data = {
        "Suggestions": enable,
        "SuggestionsChannel": status != 1 ? channel : null
    }

    await updateorCreateServer(data, interaction);

    let embed = await embedSuggestion.StatusChanged(status, channel);

    await interaction.update({ embeds: [embed], components: [] });

    if(interaction.type == 3 && channel){
        let channelObject = await interaction.client.channels.cache.get(channel);
        let embed = await embedSuggestion.SuggestionsChannel(channelObject.type, interaction.guild);

        if(channelObject.type == 0){
            await channelObject.send({ embeds: [embed] });
        }
        if(channelObject.type == 15){
            const thread = await channelObject.threads.create({
                name: "Suggestions",
                message: { embeds: [embed] },
            });

            const initialMessage = await thread.fetchStarterMessage();

            // Pinning the initial message
            if (initialMessage) {
              await initialMessage.pin();
            }
        }
    }
}