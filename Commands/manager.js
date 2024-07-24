const {
    SlashCommandBuilder,
    RoleSelectMenuBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ChannelSelectMenuBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    PermissionFlagsBits
} = require("discord.js");
const { embedInfoError, embedManage } = require("../embeds.js");
const { info, warn, error } = require("../src/log.js");
const { sendMenuBuilders, enableDisablePrompt, enableCommandForGuild, disableCommandForGuild, getServer, createServer, updateServer } = require("../utils/utils.js");

module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName("manager")
        .setDescription("Staff Management Commands")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
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
            let server = await getServer(interaction)
            if(!server){
                await interaction.reply({
                    embeds: [embedInfoError.ServerConnectionError],
                    ephemeral: true,
                    components: [],
                });
                return;
            }
        } catch (e) {
            await interaction.reply({
                embeds: [embedInfoError.ServerConnectionError],
                ephemeral: true,
                components: [],
            });
            return;
        }
        
        try {
            askForSubModule(interaction);
        } catch (e) {
            error(e);
        }
    },
};
async function askForSubModule(interaction) {
    
    options = [
        new StringSelectMenuOptionBuilder()
            .setLabel('Staff Leave')
            .setDescription('Staff Leave.')
            .setValue('StaffLeave'),
        new StringSelectMenuOptionBuilder()
            .setLabel('Promotion')
            .setDescription('Promtion and Demotions.')
            .setValue('Promotion'),
    ]
    
    const subCategorySelect = new StringSelectMenuBuilder()
        .setCustomId('xsubcategory')
        .setPlaceholder('Choose a SubCategory!')
        .addOptions(options);

    let Selected;
    try{
        Selected = await sendMenuBuilders(
            interaction,
            subCategorySelect,
            true,
            embedManage.Management,
            options,
            true
        );
    } catch (e) {
        return;
    }



    interaction = Selected[1];
    Selected = Selected[0];

    if (Selected == 'StaffLeave'){
        let result = await enableDisablePrompt(interaction, 'StaffLeave')
        interaction = result[0]
        result = result[1]

        if (result == 1){
            // Enable
            try {
                interaction = await SendStaffLeaveQuestions(interaction)
            } catch (e) {
                return;
            }
            
            if(!interaction){
                return;
            }
            await interaction.update({ embeds: [embedManage.PromotionEnabled], components: []})
        } else if (result == 2){
            // Edit
            try {
                interaction = await SendStaffLeaveQuestions(interaction)
            } catch (e) {
                return;
            }
            
            await interaction.update({ embeds: [embedManage.PromotionEdit], components: []})
        } else if (result == 3){
            // Disable
            const data = {
                StaffLeave: false,
                RequestStaffLeaveChannel: null,
            }

            await updateServer(data, interaction) 

            await interaction.update({embeds: [embedManage.PromotionDisabled], components: []})
        }
    }
    if (Selected == 'Promotion'){
        let result = await enableDisablePrompt(interaction, 'Promotion')
        interaction = result[0]
        result = result[1]

        if (result == 1){
            // Enable
            interaction = await SendPromtionQuestions(interaction)
            
            await interaction.update({ embeds: [embedManage.PromotionEnabled], components: []})
        } else if (result == 2){
            // Edit
            interaction = await SendPromtionQuestions(interaction)
            
            await interaction.update({ embeds: [embedManage.PromotionEdit], components: []})
        } else if (result == 3){
            // Disable
            const data = {
                Promotion: false,
                StaffManagementRoles: null,
                StaffModeraterRoles: null
            }

            await updateServer(data, interaction)

            await disableCommandForGuild(interaction, 'promote')
            await disableCommandForGuild(interaction, 'demote')   

            await interaction.update({embeds: [embedManage.PromotionDisabled], components: []})
        }
    }
}
async function SendStaffLeaveQuestions(interaction) {
    const selectManagementRoles = new ChannelSelectMenuBuilder()
        .setCustomId("channel")
        .setMinValues(1)
        .setMaxValues(1)
        .setChannelTypes([0])
        .setPlaceholder("Select a Channel to post the Staff Leave Request Button in.");

    const selectembed = embedManage.channelSelect;

    let channel;
    try {
        channel = await sendMenuBuilders(
            interaction,
            selectManagementRoles,
            true,
            selectembed,
        );
    } catch (error) {
        return;
    }

    if (!channel) {
        return;
    }

    interaction = channel[1];
    channelText = channel[0][0];

    const SelectChanneltoPost = new ChannelSelectMenuBuilder()
        .setCustomId("postchannel")
        .setMinValues(1)
        .setMaxValues(1)
        .setChannelTypes([0])
        .setPlaceholder("Select a Channel to post the Staff Leave Requests in for review.");

    const postembed = embedManage.postChannelSelect;
    let postchannel;
    try {
        postchannel = await sendMenuBuilders(
            interaction,
            SelectChanneltoPost,
            true,
            postembed,
        );
    } catch (error) {
        return;
    }

    if (!postchannel) {
        return;
    }

    interaction = postchannel[1];
    postchannel = postchannel[0][0];

    const data = {
        StaffLeave: true,
        RequestStaffLeaveChannel: channelText,
    }

    let server = await getServer(interaction)

    if(server.exists){
        await updateServer(data, interaction);
    } else {
        await createServer(data, interaction)
    }

    const components = 
        new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('staffleaverequest')
                    .setLabel('Staff Leave')
                    .setStyle('Secondary')
            );

    let channelObject = await interaction.client.channels.cache.get(postchannel);
    await channelObject.send({embeds: [embedManage.StaffLeavePost], components: [components]})

    return interaction;
}

async function SendPromtionQuestions(interaction) {
    const selectManagementRoles = new RoleSelectMenuBuilder()
        .setCustomId("manmention")
        .setPlaceholder("Select Management Roles")
        .setMinValues(1)
        .setMaxValues(5);

    const selectembed = embedManage.selectManageRoles;
    let ManRoles;
    try {
        ManRoles = await sendMenuBuilders(
            interaction,
            selectManagementRoles,
            true,
            selectembed,
        );
    } catch (error) {
        return;
    }

    if (!ManRoles) {
        return;
    }
    interaction = ManRoles[1];
    ManRoles = ManRoles[0];
    let rolesManText = [];
    for (let i = 0; i < ManRoles.length; i++) {
        rolesManText.push(ManRoles[i].id);
    }

    const selectModeraterRoles = new RoleSelectMenuBuilder()
        .setCustomId("modmention")
        .setPlaceholder("Select Moderater Roles")
        .setMinValues(1)
        .setMaxValues(5);

    const roleembed = embedManage.selectModeraterRoles;
    let roles 
    try {
        roles = await sendMenuBuilders(
            interaction,
            selectModeraterRoles,
            true,
            roleembed,
        );
    } catch (error) {
        return;
    } 
    if (!roles) {
        return;
    }
    interaction = roles[1];
    roles = roles[0];
    let rolesModText = [];
    for (let i = 0; i < roles.length; i++) {
        rolesModText.push(roles[i].id);
    }

    const data = {
        Promotion: true,
        StaffManagementRoles: JSON.stringify(rolesManText),
        StaffModeraterRoles: JSON.stringify(rolesModText)
    }

    let server = await getServer(interaction)
    if(server.exists){
        await updateServer(data, interaction);
        await enableCommandForGuild(interaction, 'promote')
        await enableCommandForGuild(interaction, 'demote')
    } else {
        await createServer(data, interaction)
        await enableCommandForGuild(interaction, 'promote')
        await enableCommandForGuild(interaction, 'demote')
    }

    return interaction;
}