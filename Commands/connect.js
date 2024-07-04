const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    SlashCommandBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits} = require("discord.js");
const { info, error } = require("../src/log.js");
const {
    embedConnect } = require("../embeds.js");
const axios = require("axios");

module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName('connect')
        .setDescription('Advertise your community on the web.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
      if (!interaction.guildId) {
          await interaction.reply({
              embeds: [embedConnect.ServerError],
              ephemeral: true,
          });
          return;
      }
      if (interaction.member.id !== interaction.guild.ownerId) {
          await interaction.reply({
              embeds: [embedConnect.ServerOwner],
              ephemeral: true,
          });
          return;
      }
        try {
            DiscoverySubCommand(interaction);
        } catch (error) {
            error(error);
        }
    },
};

async function ChangeConnect(status, interaction, old, reply) {

    if(!old.data.exists){
        return;
    }

    const invite = await interaction.channel.createInvite({
        maxUses: 0,
        maxAge: 0,
        unique: true,
    });

    data = {
        ServerID: interaction.guild.id,
        ServerName: interaction.guild.name,
        MemberCount: interaction.guild.memberCount,
        ServerIcon: interaction.guild.iconURL(),
        ServerBanner: interaction.guild.bannerURL(),
        ServerOwner: interaction.guild.ownerId,
        Connect: status,
        ServerInvite: String(invite.url),
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

    if(reply){
        const embed = await embedConnect.StatusChange(status, response.data.server)
        try {
            await interaction.update({
                embeds: [embed],
                components: [],
            });
        } catch (error) {
            await interaction.reply({
                embeds: [embed],
                components: [],
            });
        }
    }
}

// Main Screen (Enable or Disable)
async function DiscoverySubCommand(interaction) {
    let old = await axios.get(
        `${process.env.DATABASE_URL}${process.env.STORAGE_PATH}/servers/find/${interaction.guildId}`,
    );
    
    const Connect_Enable = new ButtonBuilder()
        .setCustomId("xconnect-enable")
        .setLabel("Enable")
        .setStyle(ButtonStyle.Primary);

    const Connect_Edit = new ButtonBuilder()
        .setCustomId("xconnect-edit")
        .setLabel("Edit")
        .setStyle(ButtonStyle.Primary);

    let row
    if(old.data.exists && old.data.server.Connect){
        const Connect_Disable = new ButtonBuilder()
            .setCustomId("xconnect-disable")
            .setLabel("Disable")
            .setStyle(ButtonStyle.Danger);

        row = new ActionRowBuilder().addComponents(Connect_Edit, Connect_Disable);
    } else {
        const Connect_Disable = new ButtonBuilder()
            .setCustomId("xconnect-disable")
            .setLabel("Disable")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true);

        row = new ActionRowBuilder().addComponents(Connect_Enable, Connect_Disable);
    }

    const embed = await embedConnect.Connect(old.data.server.Connect, old.data.server);
    const response = await interaction.reply({
        embeds: [embed],
        components: [row],
        ephemeral: true,
    });

    const collectorFilter = i => i.user.id === interaction.user.id;
    const collector = response.createMessageComponentCollector({ filter: collectorFilter, time: 60_000 });

    collector.on('collect', async i => {
        if(i.customId == 'xconnect-enable'){
            await StartDiscoveryModal(i);
        } else if(i.customId == 'xconnect-disable'){
            collector.stop();
            await ChangeConnect(false, i, old, true);
        } else if(i.customId == 'xconnect-edit'){
            await UpdateDiscoverModal(i);
        }
    });

    collector.on('end', async collected => {
        if (collected.size === 0) {
            await interaction.editReply({ content: '`Confirmation not received within 1 minute, cancelling`', components: [] });
        }
    });
}

// Sends the Modal to the user for extra informaton
async function UpdateDiscoverModal(interaction) {
    const form = new ModalBuilder()
        .setCustomId('addserver')
        .setTitle('Edit community description');

    const descriptionInput = new TextInputBuilder()
        .setCustomId('addserver-set-description')
        // NOTE: If you want to modify the Label below, we believe it needs to be under 50 characters. Any more, and it will throw an error.
        .setLabel('COMMUNITY DESCRIPTION')
        .setRequired(true)
        .setMinLength(20)
        .setMaxLength(400)
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder('Write a few sentences about your community...');

    const actionRow1 = new ActionRowBuilder().addComponents(descriptionInput);
    form.addComponents(actionRow1);
    await interaction.showModal(form);
}

// Sends the Modal to the user for extra informaton
async function StartDiscoveryModal(interaction) {
    const form = new ModalBuilder()
        .setCustomId("addserver")
        .setTitle('Set a community description');

    const descriptionInput = new TextInputBuilder()
        .setCustomId("addserver-set-description")
        // NOTE: If you want to modify the Label below, we believe it needs to be under 50 characters. Any more, and it will throw an error.
        .setLabel('COMMUNITY DESCRIPTION')
        .setRequired(true)
        .setMinLength(20)
        .setMaxLength(400)
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder('Write a few sentences about your community...');

    const actionRow1 = new ActionRowBuilder().addComponents(descriptionInput);
    form.addComponents(actionRow1);
    await interaction.showModal(form);
}