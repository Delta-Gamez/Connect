require("dotenv").config();
const { Interaction, EmbedBuilder } = require("discord.js");
const { info, warn, error, nolog } = require("../src/log.js");
const { embedInfoSuccess, embedInfoError } = require("../embeds.js");
const axios = require("axios");

module.exports = {
    data: {
        name: "setup partnership modal",
        customId: "setup-partnership-submit",
        description: "Process submitted setup modals.",
    },
    async execute(interaction) {
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

        info("Modal setup Submitted for Processing.");
        await interaction.reply({
            embeds: [embedInfoSuccess.ModalSumbit],
        });

        try {
            data = {
                ServerID: interaction.guild.id,
                ServerName: interaction.guild.name,
                ShortDesc: String(
                    interaction.fields.getTextInputValue(
                        "setup-set-description",
                    ),
                ),
                MemberCount: interaction.guild.memberCount,
                ServerIcon: interaction.guild.iconURL(),
                ServerBanner: interaction.guild.bannerURL(),
                ServerOwner: interaction.guild.ownerId,
                Discovarable: false,
            };
        } catch (e) {
            error(`Error while creating server data: ${e}`);
            await interaction.editReply({
                embeds: [embedInfoError.ModalProcess],
            });
            return;
        }
        info(
            `A new server will be submitted for approval. The following server data will be sent:${JSON.stringify(data)}`,
        );
        try {
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
                    console.error(e);
                    error(e);
                    (async () => {
                        interaction.editReply({
                            embeds: [embedInfoError.ServerConnectionError],
                        });
                        return;
                    })();
                });

            let PartnerShipEmbed = new EmbedBuilder(embedInfoSuccess.Template)
                .setTitle("Partnership")
                .setDescription("Redo, This command to create the Embed!");

            await interaction.editReply({
                embeds: [PartnerShipEmbed],
                ephemeral: true,
            });
        } catch (e) {
            console.error(e);
            // Catch synchronous errors
            error(e);
            await interaction.editReply({
                embeds: [embedInfoError.ServerConnectionError],
            });
        }
    },
};
