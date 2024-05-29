const {
    ActionRowBuilder,
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    RoleSelectMenuBuilder
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

    const PartnerShip_Disable = new ButtonBuilder()
        .setCustomId("xpartnership-disable")
        .setLabel("Disable")
        .setStyle(ButtonStyle.Danger);

    const PartnerShip_Edit = new ButtonBuilder()
        .setCustomId("xpartnership-edit")
        .setLabel("Edit")
        .setStyle(ButtonStyle.Primary);

    let row
    if(old.data.exists && old.data.server.PartnerShip){
        row = new ActionRowBuilder().addComponents(PartnerShip_Edit, PartnerShip_Disable);
    } else {
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
            await ChangePartnership(true, confirmation, old, false);
            await PartnershipSubCommande(old, confirmation);
        } else if(confirmation.customId == 'xpartnership-disable'){
            await ChangePartnership(false, confirmation, old, true);
        } else if(confirmation.customId == 'xpartnership-edit'){
            await PartnershipSubCommande(old, confirmation);
        }
    } catch (e) {
        console.error(e)
        await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
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
        StartPartnershipModal(interaction);
    } else {
        SendPartnerShipEmbed(interaction);
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

async function SendPartnerShipEmbed(interaction) {
    const select = new ChannelSelectMenuBuilder()
        .setCustomId("channels")
        .setPlaceholder("Pick a Channel")
        .setChannelTypes(0);

    const selectrole = new RoleSelectMenuBuilder()
        .setCustomId("roles")
        .setPlaceholder("Pick a Role")

    const continueButton = new ButtonBuilder()
        .setCustomId("xcontinue")
        .setLabel(">")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true);

    const row = new ActionRowBuilder().addComponents(select);
    const row2 = new ActionRowBuilder().addComponents(selectrole);
    let row3 = new ActionRowBuilder().addComponents(continueButton);
    const pickAChannelEmbed = new EmbedBuilder().setTitle("Pick a Channel");
    const response = await interaction.update({
        embeds: [pickAChannelEmbed],
        components: [row, row2, row3],
        ephemeral: true,
    });

    const collectorFilter = i => i.user.id === interaction.user.id;

    const collector = interaction.channel.createMessageComponentCollector({ filter: collectorFilter, time: 60_000 });

    let selectedChannel = null;
    let selectedRole = null;

    collector.on('collect', async i => {

        if (i.customId === 'channels') {
            row3 = new ActionRowBuilder().addComponents(continueButton.setDisabled(false))
            selectedChannel = i.values[0];
            await i.update({ components: [row, row2, row3] });
        }

        if (i.customId === 'roles') {
            selectedRole = i.values[0];
            await i.update({ components: [row, row2, row3] });
        }

        if (i.customId === 'xcontinue') {
            if (selectedChannel) {
                await SendEmbededMessage(i, selectedChannel, selectedRole)
                collector.stop(); // Stop the collector once the button is pressed and the channel is selected
            } else {
                await i.reply({ content: 'Please select a channel before continuing.', ephemeral: true });
            }
        }
    });

    collector.on('end', async collected => {
        if (collected.size === 0) {
            await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
        }
    });
}

async function SendEmbededMessage(interaction, channelid, roleid){
    const channel = await interaction.guild.channels.cache.get(channelid);

    let PartnerShipEmbed;
    if (roleid) {
        PartnerShipEmbed = new EmbedBuilder()
            .setTitle("Partnership")
            .setDescription(
                `Press Open to request a partnership with this server.\nThis would ping the role : <@&${roleid}>`,
            )
            .setColor("#004898");
    } else {
        PartnerShipEmbed = new EmbedBuilder()
            .setTitle("Partnership")
            .setDescription(
                "Press Open to request a partnership with this server.",
            )
            .setColor("#004898");
    }

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