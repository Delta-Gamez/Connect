const config = require('./config.json');

const { Client, IntentsBitField, Events } = require('discord.js');
const { info, warn, error, nolog } = require('./src/log.js');
const { load, register } = require('./src/loader.js');


intents = new IntentsBitField();
intents.add(IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.MessageContent);

var client = new Client({
    intents: intents
})

client.once('ready', async readyclient => {
    info(`(RDY) Logged In as ${readyclient.user.tag}`);
    info('Attempting: Register Commands in Guilds');
    await register(readyclient);
    warn(`(NOTICE) Please allow up to 2 Minutes to prepare interactions. Commands sent without waiting will raise error 10062. Thank you for your patience.`);
});

client.rest.on('rateLimited', (rateLimitInfo) => {
    warn(`Rate Limit has been exceeded. Timeout: ${rateLimitInfo.timeToReset}ms.`);
})

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) {
            info(`Interaction Requested: ${interaction.commandName} (Not Found)`);
            await interaction.reply({
                content:`Command ${interaction.commandName} not found.`,
                ephemeral: true
            });
            return;
        };
        info(`Interaction Requested: ${interaction.commandName} (Success)`);
        try {
            await command.execute(interaction);
            info(`Executed Command: ${interaction.commandName} (Success)`);
        } catch (e) {
            error(`Error while Executing Command ${interaction.commandName}: ${e}`);
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({
                    content: 'There was an error running that command. Try again later, or if the error persists, let us know.'
                });
            } else {
                await interaction.reply({
                    content: 'There was an error running that command. Try again later, or if the error persists, let us know.'
                });
            }
        }
    } else if (interaction.isButton()) {
        const button = client.buttons.get(interaction.customId);
        if (!button) {
            info(`Button Requested: ${interaction.customId} (Not Found)`);
            await interaction.reply({
                content:`Button ${interaction.customId} not found.`,
                ephemeral: true
            });
            return;
        }
        info(`Button Requested: ${interaction.customId} (Success)`);
        try {
            await button.execute(interaction);
            info(`Executed Button: ${interaction.customId} (Success)`);
        } catch (e) {
            error(`Error while Executing Button ${interaction.customId}: ${e}`);
        }
    } else if (interaction.isModalSubmit()) {
        const modal = client.modals.get(interaction.customId);
        if (!modal) {
            info(`Modal Requested: ${interaction.customId} (Not Found)`);
            await interaction.reply({
                content:`Modal ${interaction.customId} not found.`,
                ephemeral: true
            });
            return;
        }
        info(`Modal Requested: ${interaction.customId} (Success)`);
        try {
            await modal.execute(interaction);
            info(`Executed Modal: ${interaction.customId} (Success)`);
        } catch (e) {
            error(`Error while Executing Modal ${interaction.customId}: ${e}`);
        }
    }
});

client.on('error', (e) => {
    error(`Runtime Error: ${e}`);
});

info('Loading Commands');
load(client);
info('Logging In');
client.login(config["discord-token"]);