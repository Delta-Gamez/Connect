const { Interaction } = require('discord.js');
const { info, warn, error, nolog } = require('../../../src/log.js');

/**
 * @param {Interaction} interaction
 */
async function ping(interaction) {
    await interaction.reply({
        content:`Pong! Latency is ${interaction.client.ws.ping}ms.`,
        ephemeral: true
    });
}

module.exports = {
    name: 'ping',
    description: 'Ping the bot.',
    async execute(interaction) {
        await ping(interaction);
    }
};
