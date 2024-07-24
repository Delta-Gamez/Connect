const {
    ActionRowBuilder,
    SlashCommandBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    RoleSelectMenuBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    PermissionFlagsBits, 
    EmbedBuilder} = require("discord.js");
const { info, error } = require("../src/log.js");
const { embedPartnership, embedInfoError, messageButtonTimeout } = require("../embeds.js");
const { askQuestion, updateServer, getServer} = require("../utils/utils.js");
const sendMenuBuilders = require("../utils/sendMenuBuilders.js");
const axios = require("axios");

module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName('partnership')
        .setDescription('Manage your partnerships')
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
                embeds: [embedPartnership.ErrorServerOwner],
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

    let partnershipEnabled = false
    let serverData = old.data.server;
    if(!old.data.exists){
        partnershipEnabled = false;
        serverData = {
            PartnerShip: false,
            ServerName: interaction.guild.name,
            ServerID: interaction.guild.id,
            MemberCount: interaction.guild.memberCount,
            ServerIcon: interaction.guild.iconURL(),
            ServerBanner: interaction.guild.bannerURL(),
            ServerOwner: interaction.guild.ownerId,
        }
    } else {
        partnershipEnabled = old.data.server.PartnerShip;
    }
    const embed = await embedPartnership.ModuleInfo(partnershipEnabled,serverData);
    const response = await interaction.reply({
        embeds: [embed],
        components: [row],
        ephemeral: true,
    });

    const collectorFilter = i => i.user.id === interaction.user.id;
    const collector = response.createMessageComponentCollector({ filter: collectorFilter, time: 60_000 });

    collector.on('collect', async confirmation => {
        if(confirmation.customId == 'xpartnership-enable'){
            await PartnershipSubCommande(old, confirmation, true);
            await ChangePartnership(true, confirmation, old, false);
        } else if(confirmation.customId == 'xpartnership-disable'){
            collector.stop();
            await ChangePartnership(false, confirmation, old, true);
        } else if(confirmation.customId == 'xpartnership-edit'){
            await PartnershipSubCommande(old, confirmation, false);
        }
    });

    collector.on('end', async collected => {
        if (collected.size === 0) {
            await interaction.editReply({ content: messageButtonTimeout, components: [] });
        }
    });
}

async function ChangePartnership(status, interaction, old, reply) {
    const removedembed = await embedPartnership.StatusChange(status);
    if(!old.data.exists){
        return;
    }

    data = {
        PartnerShip: status,
    };

    await updateServer(data, interaction)

    if(reply){
        await interaction.update({
            embeds: [removedembed],
            ephemeral: true,
            components: [],
        });
    }
}

async function PartnershipSubCommande(old, interaction, enable) {
    if (old.data.status != 200) {
        await StartPartnershipModal(interaction, enable);
    } else {
        await SendPartnerShipEmbed(interaction, enable);
    }
}

async function StartPartnershipModal(interaction, enable) {
    data = {
        PartnerShip: true,
    };

    const response = await updateServer(data, interaction);

    if(!response){
        await interaction.reply({
            embeds: [embedInfoError.ServerConnectionError],
            ephemeral: true,
            components: [],
        });
        return;
    }

    if(response.data.status == 200){
        PartnershipSubCommande(response, interaction, enable);
    }
}

async function SendPartnerShipEmbed(interaction, enable) {
    const server = await getServer(interaction);

    const select = new ChannelSelectMenuBuilder()
    .setCustomId("channels")
    .setPlaceholder("Pick a Channel")
    .setChannelTypes(0);

    const selectembed = embedPartnership.ChannelSelection;
    
    let channelid;
    try {
        channelid = await sendMenuBuilders(interaction, select, true, selectembed);
    } catch (error) {
        console.log(error)
        return;
    }

    if (!channelid) {
        return;
    }
    interaction = channelid[1];
    channelid = channelid[0][0];

    const selectrole = new RoleSelectMenuBuilder()
    .setCustomId("mention")
    .setPlaceholder("Select a Role to Mention")
    .setMinValues(1)
    .setMaxValues(5);

    const roleembed = embedPartnership.RoleSelection;
    let roles;
    try {
        roles = await sendMenuBuilders(interaction, selectrole, false, roleembed);
    } catch (error) {
        return;
    }
    
    if (!roles) {
        return;
    }
    interaction = roles[1];
    roles = roles[0];
    let rolesText = ""
    if(roles){
        for (let i = 0; i < roles.length; i++) {
            rolesText += `<@&${roles[i]}> `;
        }
    } else {
        rolesText = null;
    }


    const memberRequirementOptions =[
        new StringSelectMenuOptionBuilder()
            .setLabel('None')
            .setValue('none')
            .setDescription('No member requirement'),
        new StringSelectMenuOptionBuilder()
            .setLabel('25 Members')
            .setValue('25+ Members')
            .setDescription('25 members minimum'),
        new StringSelectMenuOptionBuilder()
            .setLabel('50 Members')
            .setValue('50+ Members')
            .setDescription('50 members minimum'),
        new StringSelectMenuOptionBuilder()
            .setLabel('100 Members')
            .setValue('100+ Members')
            .setDescription('100 members minimum'),
        new StringSelectMenuOptionBuilder()
            .setLabel('250 Members')
            .setValue('250+ Members')
            .setDescription('250 members minimum'),
        new StringSelectMenuOptionBuilder()
            .setLabel('500 Members')
            .setValue('500+ Members')
            .setDescription('500 members minimum'),
        new StringSelectMenuOptionBuilder()
            .setLabel('1,000 Members')
            .setValue('1,000+ Members')
            .setDescription('1,000 member minimum')
        ]


    const memberRequirements = new StringSelectMenuBuilder()
        .setCustomId('xmember-requirements')
        .setPlaceholder('Select a Member Requirement')
        .addOptions(memberRequirementOptions);

    const memberRequirementembed = embedPartnership.MemberRequirementSelection;
    
    let memberRequirement;
    try {
        memberRequirement = await sendMenuBuilders(interaction, memberRequirements, false, memberRequirementembed, memberRequirementOptions);
    } catch (error) {
        return;
    }

    if (!memberRequirement) {
        return;
    }

    interaction = memberRequirement[1];
    memberRequirement = memberRequirement[0];
    if(!memberRequirement){
        memberRequirement = 'none';
    }

    const embed = embedPartnership.QuestionsSelection;

    const options = [
        new StringSelectMenuOptionBuilder()
            .setLabel('Custom Questions')
            .setValue('custom')
            .setDescription('Ask custom questions for partnership requests'),
        new StringSelectMenuOptionBuilder()
            .setLabel('Default Questions')
            .setValue('default')
            .setDescription('Use the default questions for partnership requests'),
        new StringSelectMenuOptionBuilder()
            .setLabel('No Questions')
            .setValue('no')
            .setDescription('Do not ask questions for partnership requests'),
    ]

    const noyes = new StringSelectMenuBuilder()
        .setCustomId('xquestions')
        .setPlaceholder('Select an Option')
        .addOptions(options);

    let questions = [];
    while (questions && questions.length === 0) {
        let option
        try {
            option = await sendMenuBuilders(interaction, noyes, true, embed, options);
        } catch (error) {
            return;
        }

        if (!option) {
            return;
        }

        interaction = option[1];
        option = option[0];

        switch (option) {
            case 'custom':
                try {
                    questions = await askQuestion(interaction, ["Questions to ask", "Partnership request Qs."], [], server.server.Premiumlevel == 1 ? 6 : 3, embedPartnership.CustomQuestions, embedPartnership.removeEmbed, true)
                } catch (error) {
                    return;
                }
                if(!questions) return;
                if(questions == 'error') return;
                interaction = questions[0];
                questions = questions[1];
                break;
            case 'default':
                questions = ["What is your community name?", "What is your member count?", "Why would you like to partner?", "Can you provide a Discord invite?"];
                break;
            case 'no':
                questions = null;
                break;
        }
    }

    await SendEmbededMessage(interaction, channelid, rolesText, memberRequirement, questions, enable)
}

async function SendEmbededMessage(interaction, channelid, roleMention, memberRequirement, questions, enable){
    data = {
        PartnerShipQuestions: JSON.stringify(questions)
    }

    await updateServer(data, interaction);
    const channel = await interaction.guild.channels.cache.get(channelid);
    let PartnershipEmbed = await embedPartnership.PartnershipRequest(memberRequirement, roleMention, interaction.guild, questions)

    let button = new ButtonBuilder()
        .setCustomId("partnershiprequest")
        .setEmoji(`<:DG_CO_Ticket:1141308990446379029>`)
        .setLabel(`Request`)
        .setStyle(ButtonStyle.Primary);

    let actionRow = new ActionRowBuilder().addComponents(button);

    await channel.send({
        embeds: [PartnershipEmbed],
        components: [actionRow],
    });

    let embed = await embedPartnership.PartnershipRequester(channelid, enable, memberRequirement, roleMention, questions)

    await interaction.update({
        embeds: [embed],
        ephemeral: true,
        components: [],
    });
    return;
}