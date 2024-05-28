require("dotenv").config();
const { Interaction, EmbedBuilder } = require("discord.js");
const { info, warn, error, nolog } = require("../src/log.js");
const { embedInfoSuccess, embedInfoError } = require("../embeds.js");
const axios = require("axios");

module.exports = {
    data: {
        name: "addserver modal submit",
        customId: "addserver-submit",
        description: "Process submitted addserver modals.",
    },
    async execute(interaction) {
        await checkServerOwner(interaction);
        info("Modal addserver Submitted for Processing.");
        await interaction.reply({
            embeds: [embedInfoSuccess.ModalSumbit],
        });
        try {
            let data = await createData(interaction);
        } catch (e) {
            error(`Error while creating server data: ${e}`);
            await interaction.editReply({
                embeds: [embedInfoError.ModalProcess],
            });
            return;
        }
        info(
            `A new server will be submitted for approval. The following server data will be sent: ${JSON.stringify(data)}`,
        );
        try {
            createServer(interaction, data);
        } catch (e) {
            // Catch synchronous errors
            error(e);
            await interaction.editReply({
                embeds: [embedInfoError.ServerConnectionError],
            });
        }
    },
};

async function checkServerOwner(interaction) {
    if (
        !(
            interaction.member.id &&
            interaction.guild.ownerId &&
            parseInt(interaction.member.id) ===
                parseInt(interaction.guild.ownerId)
        )
    ) {
        await interaction.reply({
            embeds: [embedInfoError.ServerOwner],
        });
        return;
    }
}
async function createData(interaction) {
    const invite = await interaction.channel.createInvite({
        maxUses: 0,
        maxAge: 0,
        unique: true,
    });
    data = {
        ServerID: interaction.guild.id,
        ServerName: interaction.guild.name,
        ShortDesc: String(
            interaction.fields.getTextInputValue("addserver-set-description"),
        ),
        MemberCount: interaction.guild.memberCount,
        ServerInvite: String(invite.url),
        ServerIcon: interaction.guild.iconURL(),
        ServerBanner: interaction.guild.bannerURL(),
        ServerOwner: interaction.guild.ownerId,
        Discoverable: true,
    };

    return data;
}
async function createServer(interaction, data) {
    await axios
        .post(
            `${process.env.DATABASE_URL}${process.env.STORAGE_PATH}/servers`,
            data,
            {
                headers: {
                    Authorization: `${process.env.DATABASE_TOKEN}`,
                },
                withCredentials: true,
            },
        )
        .then((response) => {
            if (response.status != 200) {
                throw new Error(
                    `Request failed with status ${response.status} and body ${response.body}`,
                );
            }
        })
        .catch((e) => {
            error(e);
            (async () => {
                interaction.editReply({
                    embeds: [embedInfoError.ServerConnectionError],
                });
            })();
        });
}
