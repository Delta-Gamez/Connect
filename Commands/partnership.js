const {
    ActionRowBuilder,
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    RoleSelectMenuBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} = require("discord.js");
const { info, error } = require("../src/log.js");
const { embedInfoError, embedInfoSuccess } = require("../embeds.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("partnership")
        .setDescription("Setup Partnership"),
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
    let old = await axios.get(
        `${process.env.DATABASE_URL}${process.env.STORAGE_PATH}/servers/find/${interaction.guildId}`,
    );
    
    const embedModulePartnership = new EmbedBuilder()
        .setTitle("Partnership")
        .setDescription("Would you like to setup the partnership module?")
        .setColor("#004898");
    
    const PartnerShip_Enable = new ButtonBuilder()
        .setCustomId("xpartnership-enable")
        .setLabel("Enable")
        .setStyle(ButtonStyle.Primary);

    const PartnerShip_Edit = new ButtonBuilder()
        .setCustomId("xpartnership-edit")
        .setLabel("Edit")
        .setStyle(ButtonStyle.Primary);

    let row
    if(old.data.exists && old.data.server.PartnerShip){
        const PartnerShip_Disable = new ButtonBuilder()
        .setCustomId("xpartnership-disable")
        .setLabel("Disable")
        .setStyle(ButtonStyle.Danger)

        row = new ActionRowBuilder().addComponents(PartnerShip_Edit, PartnerShip_Disable);
    } else {
        const PartnerShip_Disable = new ButtonBuilder()
            .setCustomId("xpartnership-disable")
            .setLabel("Disable")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true)
            
        row = new ActionRowBuilder().addComponents(PartnerShip_Enable, PartnerShip_Disable);
    }

    const response = await interaction.reply({
        embeds: [embedModulePartnership],
        components: [row],
        ephemeral: true,
    });

    const collectorFilter = i => i.user.id === interaction.user.id;
    try {
        const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
        if(confirmation.customId == 'xpartnership-enable'){
            await PartnershipSubCommande(old, confirmation);
            await ChangePartnership(true, confirmation, old, false);
        } else if(confirmation.customId == 'xpartnership-disable'){
            await ChangePartnership(false, confirmation, old, true);
        } else if(confirmation.customId == 'xpartnership-edit'){
            await PartnershipSubCommande(old, confirmation);
        }
    } catch (e) {
        console.log(e)
        if(e.size === 0){
            await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
        }
    }
}

async function ChangePartnership(status, interaction, old, reply) {
    const removedembed = new EmbedBuilder(embedInfoSuccess.Template)
        .setTitle("Partnership")
        .setDescription(`Partnership has been ${status ? "Enabled" : "Disabled"}`);
    
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

    data = {
        ServerID: interaction.guild.id,
        ServerName: interaction.guild.name,
        MemberCount: interaction.guild.memberCount,
        ServerIcon: interaction.guild.iconURL(),
        ServerBanner: interaction.guild.bannerURL(),
        ServerOwner: interaction.guild.ownerId,
        PartnerShip: status,
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

    console.log(response)

    if(reply){
        await interaction.update({
            embeds: [removedembed],
            ephemeral: true,
            components: [],
        });
    }
}

async function PartnershipSubCommande(old, interaction) {
    if (old.data.status != 200) {
        await StartPartnershipModal(interaction);
    } else {
        await SendPartnerShipEmbed(interaction);
    }
}

async function StartPartnershipModal(interaction) {
    data = {
        ServerID: interaction.guild.id,
        ServerName: interaction.guild.name,
        MemberCount: interaction.guild.memberCount,
        ServerIcon: interaction.guild.iconURL(),
        ServerBanner: interaction.guild.bannerURL(),
        ServerOwner: interaction.guild.ownerId,
        Connect: false,
        PartnerShip: true,
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
        PartnershipSubCommande(response, interaction);
    }
}

async function coll(interaction, component, requiremnet, embed, options) {
    let row1 = new ActionRowBuilder().addComponents(component);

    const continueButton = new ButtonBuilder()
    .setCustomId("xcontinue")
    .setLabel(">")
    .setStyle(ButtonStyle.Primary)
    .setDisabled(requiremnet);

    let row2 = new ActionRowBuilder().addComponents(continueButton);

    const response = await interaction.update({
        embeds: [embed],
        components: [row1, row2],
        ephemeral: true,
    });

    const collectorFilter = i => i.user.id === interaction.user.id;

    const collector = interaction.channel.createMessageComponentCollector({ filter: collectorFilter, time: 60_000 });

    let selectedChannel = null;

    return new Promise((resolve, reject) => {
        collector.on('collect', async i => {
            if (i.customId === 'xcontinue') {
                collector.stop();
                resolve([selectedChannel, i]); // Resolve the Promise with the selectedChannel
            } else {
                if(!options){
                    selectedChannel = i.values;
                    row2 = new ActionRowBuilder().addComponents(continueButton.setDisabled(false))
                    await i.update({ components: [row1, row2] });
                } else {
                    selectedChannel = i.values[0]
                    const updatedMemberRequirementOptions = options.map(option =>
                        option.data.value === i.values[0] 
                            ? { ...option.data, default: true } 
                            : option.data
                    );
        
                    row1 = new ActionRowBuilder().addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('xmember-requirements')
                            .setPlaceholder('Select a Member Requirement')
                            .addOptions(updatedMemberRequirementOptions)
                    );

                    await i.update({ components: [row1, row2] });
                }
            }
        });

        collector.on('end', async collected => {
            if (collected.size === 0) {
                console.log(collected)
                console.log(`RESET`)
                await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
                reject('Confirmation not received within 1 minute'); // Reject the Promise if no confirmation was received
            }
        });
    });
}
async function SendPartnerShipEmbed(interaction) {

    const select = new ChannelSelectMenuBuilder()
    .setCustomId("channels")
    .setPlaceholder("Pick a Channel")
    .setChannelTypes(0);

    const selectembed = new EmbedBuilder()
    .setTitle("Pick a Channel");

    let channelid = await coll(interaction, select, true, selectembed);
    interaction = channelid[1];
    channelid = channelid[0][0];

    const selectrole = new RoleSelectMenuBuilder()
    .setCustomId("mention")
    .setPlaceholder("Select a Role to Mention")
    .setMinValues(1)
    .setMaxValues(5);

    const roleembed = new EmbedBuilder()
    .setTitle("Pick a Role");

    let roles = await coll(interaction, selectrole, false, roleembed);
    interaction = roles[1];
    roles = roles[0];
    let rolesText = ""
    for (let i = 0; i < roles.length; i++) {
        rolesText += `<@&${roles[i]}> `;
    }

    const memberRequirementoptions =[
        new StringSelectMenuOptionBuilder()
            .setLabel('None')
            .setValue('none')
            .setDescription('No Member Requirement')
            .setEmoji('🚫'),
        new StringSelectMenuOptionBuilder()
            .setLabel('25+ Members')
            .setValue('25+ Members')
            .setDescription('25+ Members Requirment'),
        new StringSelectMenuOptionBuilder()
            .setLabel('50+ Members')
            .setValue('50+ Members')
            .setDescription('50+ Members Requirment'),
        new StringSelectMenuOptionBuilder()
            .setLabel('100+ Members')
            .setValue('100+ Members')
            .setDescription('100+ Members Requirment'),
        new StringSelectMenuOptionBuilder()
            .setLabel('250+ Members')
            .setValue('250+ Members')
            .setDescription('250+ Members Requirment'),
        new StringSelectMenuOptionBuilder()
            .setLabel('500+ Members')
            .setValue('500+ Members')
            .setDescription('500+ Members Requirment'),
        new StringSelectMenuOptionBuilder()
            .setLabel('1,000+ Members')
            .setValue('1,000+ Members')
            .setDescription('1,000+ Members Requirment')
        ]


    const memberRequirements = new StringSelectMenuBuilder()
        .setCustomId('xmember-requirements')
        .setPlaceholder('Select a Member Requirement')
        .addOptions(memberRequirementoptions);

    const memberRequirementembed = new EmbedBuilder()
        .setTitle('Member Requirements');

    let memberRequirement = await coll(interaction, memberRequirements, false, memberRequirementembed, memberRequirementoptions);
    interaction = memberRequirement[1];
    memberRequirement = memberRequirement[0];
    if(memberRequirement[0] == 'none'){
        memberRequirement = null;
    }

    await SendEmbededMessage(interaction, channelid, rolesText, memberRequirement)
}

async function SendEmbededMessage(interaction, channelid, roleMention, memberRequirement){
    const channel = await interaction.guild.channels.cache.get(channelid);
    partnerShipEmbedDescription = "Press Open to request a partnership with this server."
    if(memberRequirement){
        partnerShipEmbedDescription += `\nRequirements: ${memberRequirement}`;
    }
    if (roleMention) {
        partnerShipEmbedDescription += `\nThis would ping the role(s) : ${roleMention}`;
    }

    const PartnerShipEmbed = new EmbedBuilder()
        .setTitle("Partnership")
        .setDescription(partnerShipEmbedDescription)
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

    let embed = new EmbedBuilder(embedInfoSuccess.Template)
        .setTitle("Setup Partnership")
        .setDescription(`PartnerShip Openner message sent to: ${channel}`);

    await interaction.update({
        embeds: [embed],
        ephemeral: true,
        components: [],
    });
    return;
}