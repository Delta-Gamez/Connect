const {
    SlashCommandBuilder,
    EmbedBuilder,
    RoleSelectMenuBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder} = require("discord.js");
const { embedInfoError, embedManage } = require("../embeds.js");
const { info, warn, error } = require("../src/log.js");
const { sendMenuBuilders, enableDisablePrompt, enableCommandForGuild, disableCommandForGuild, getServer, createServer, updateServer } = require("../utils/utils.js");
const axios = require("axios");

module.exports = {
    global: false,
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
            await axios.get(
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

    let Selected = await sendMenuBuilders(
        interaction,
        subCategorySelect,
        true,
        embedManage.Management,
        options,
        true
    );

    interaction = Selected[1];
    Selected = Selected[0];

    if (Selected == 'StaffLeave'){
        let result = await enableDisablePrompt(interaction, 'StaffLeave')
        interaction = result[0]
        result = result[1]

        if (result == 1){
            // Enable
            interaction = await SendPromtionQuestions(interaction)

            await interaction.update({ embeds: [embedManage.StaffLeaveEnabled]})
        } else if (result == 2){
            // Edit
            interaction = await SendPromtionQuestions(interaction)

            await interaction.update({ embeds: [embedManage.StaffLeaveEdited]})
        } else if (result == 3){
            // Disable
            const data = {
                StaffLeave: false,
                RequestStaffLeaveChannel: null
            }

            updateServer(data, interaction)

            interaction.update({embeds: [embedManage.StaffLeaveDisabled]})
        }
    }
    if (Selected == 'Promotion'){
        let result = await enableDisablePrompt(interaction, 'Promotion')
        interaction = result[0]
        result = result[1]

        if (result == 1){
            // Enable
            interaction = await SendPromtionQuestions(interaction)

            await enableCommandForGuild(interaction, 'promote')
            await enableCommandForGuild(interaction, 'demote')
            
            await interaction.update({ embeds: [embedManage.PromotionEnabled]})
        } else if (result == 2){
            // Edit
            interaction = await SendPromtionQuestions(interaction)

            try {
                await enableCommandForGuild(interaction, 'promote')
                await enableCommandForGuild(interaction, 'demote')
            } catch (e){
                
            }
            
            await interaction.update({ embeds: [embedManage.PromotionEdit]})
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

            await interaction.update({embeds: [embedManage.PromotionDisabled]})
        }
    }
}

async function SendPromtionQuestions(interaction) {
    const selectManagementRoles = new RoleSelectMenuBuilder()
        .setCustomId("manmention")
        .setPlaceholder("Select Management Roles")
        .setMinValues(1)
        .setMaxValues(5);

    const selectembed = new EmbedBuilder().setTitle("Select Management Roles");

    let ManRoles = await sendMenuBuilders(
        interaction,
        selectManagementRoles,
        true,
        selectembed,
    );
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

    const roleembed = new EmbedBuilder().setTitle("Select Moderater Roles");

    let roles = await sendMenuBuilders(
        interaction,
        selectModeraterRoles,
        true,
        roleembed,
    );
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
    } else {
        await createServer(data, interaction)
    }

    return interaction;
}