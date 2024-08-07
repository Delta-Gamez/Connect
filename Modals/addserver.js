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
        let old = await getServer(interaction)

        
        let oldenable = false
        if(old.server){
            oldenable = old.server.Connect
        }

        if(old.exists){            
            let data = await createData(interaction);

            await updateServer(data, interaction);
        } else {
            let data
            try {
                data = await createData(interaction);
            } catch (e) {
                error(`Error while creating server data: ${e}`);
                await interaction.reply({
                    embeds: [embedConnect.ModalProcess],
                    components: [],
                });
                return;
            }

            try {
                await createServer(data, interaction);
            } catch (e) {
                await interaction.reply({
                    embeds: [embedConnect.ErrorDatabase],
                    components: [],
                });
                return;
            }

        }

        if(oldenable){
            const embed = await embedConnect.Edited(data);
            await interaction.update({
                embeds: [embed], 
                components: [],
            });
        } else {
            await interaction.update({
                embeds: [await embedConnect.StatusChange(true, data)],
                components: [],
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