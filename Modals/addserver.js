require("dotenv").config();
const { info, warn, error, nolog } = require("../src/log.js");
const { embedConnect } = require("../embeds.js");
const { updateServer, createServer, getServer } = require("../utils/utils.js");

module.exports = {
    data: {
        name: "addserver modal submit",
        customId: "addserver",
        description: "Process submitted addserver modals.",
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
                embeds: [embedConnect.ServerOwner],
            });
            return;
        }
        
        let old = await getServer(interaction)

        if(old.exists){
            await interaction.reply({
                embeds: [embedConnect.DescriptionUpdated], 
                ephemeral: true,
            });
            
            let data = await createData(interaction);

            await updateServer(data, interaction);
        } else {
            info("Modal addserver Submitted for Processing.");
            try {
                let data = await createData(interaction);
            } catch (e) {
                error(`Error while creating server data: ${e}`);
                await interaction.editReply({
                    embeds: [embedConnect.ModalProcess],
                });
                return;
            }
            info(
                `A new server will be for approval. The following server data will be sent: ${JSON.stringify(data)}`,
            );
            try {
                await createServer(data, interaction);
            } catch (e) {
                // Catch synchronous errors
                error(e);
                await interaction.editReply({
                    embeds: [embedConnect.ErrorDatabase],
                });
            }
            await interaction.reply({
                embeds: [embedConnect.ConnectEnabled(true, data)],
            });
        }
    },
};

async function createData(interaction) {
    const invite = await interaction.channel.createInvite({
        maxUses: 0,
        maxAge: 0,
        unique: true,
    });
    data = {
        ShortDesc: String(
            interaction.fields.getTextInputValue("addserver-set-description"),
        ),
        ServerInvite: String(invite.url),
        Connect: true,
    };

    return data;
}