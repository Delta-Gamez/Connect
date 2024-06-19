const {
    ActionRowBuilder,
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    RoleSelectMenuBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    PermissionFlagsBits
} = require("discord.js");
const { info, error } = require("../src/log.js");
const { embedPartnership, embedInfoError } = require("../embeds.js");
const utils = require("../utils/utils.js");
const sendMenuBuilders = require("../utils/sendMenuBuilders.js");
const axios = require("axios");

module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName("partnership")
        .setDescription("Setup Partnership")
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
        let old;
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
            PartnershipSubCommand(old, interaction);
        } catch (error) {
            error(error);
        }
    },
};

async function PartnershipSubCommand(old, interaction) {
    
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

    const embed = await embedPartnership.Partnership(old.data.server.PartnerShip,old.data.server);
    const response = await interaction.reply({
        embeds: [],
        components: [row],
        ephemeral: true,
    });

    const collectorFilter = i => i.user.id === interaction.user.id;
    const collector = response.createMessageComponentCollector({ filter: collectorFilter, time: 60_000 });

    collector.on('collect', async confirmation => {
        if(confirmation.customId == 'xpartnership-enable'){
            await PartnershipSubCommande(old, confirmation);
            await ChangePartnership(true, confirmation, old, false);
        } else if(confirmation.customId == 'xpartnership-disable'){
            collector.stop();
            await ChangePartnership(false, confirmation, old, true);
        } else if(confirmation.customId == 'xpartnership-edit'){
            await PartnershipSubCommande(old, confirmation);
        }
    });

    collector.on('end', async collected => {
        if (collected.size === 0) {
            await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
        }
    });
}

async function ChangePartnership(status, interaction, old, reply) {
    const removedembed = new EmbedBuilder()
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
        PartnerShip: status,
    };

    let response =  await utils.updateServer(data, interaction)

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

async function SendPartnerShipEmbed(interaction) {

    const select = new ChannelSelectMenuBuilder()
    .setCustomId("channels")
    .setPlaceholder("Pick a Channel")
    .setChannelTypes(0);

    const selectembed = new EmbedBuilder()
    .setTitle("Pick a Channel");

    let channelid = await sendMenuBuilders(interaction, select, true, selectembed);
    interaction = channelid[1];
    channelid = channelid[0][0];

    const selectrole = new RoleSelectMenuBuilder()
    .setCustomId("mention")
    .setPlaceholder("Select a Role to Mention")
    .setMinValues(1)
    .setMaxValues(5);

    const roleembed = new EmbedBuilder()
    .setTitle("Pick a Role");

    let roles = await sendMenuBuilders(interaction, selectrole, false, roleembed);
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

    let memberRequirement = await sendMenuBuilders(interaction, memberRequirements, false, memberRequirementembed, memberRequirementoptions);
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
        .setCustomId("partnershiprequest")
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

    await interaction.update({
        embeds: [embed],
        ephemeral: true,
        components: [],
    });
    return;
}