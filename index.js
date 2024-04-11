const config = require('./config.json');

const { Client, IntentsBitField, Events } = require('discord.js');
const { info, warn, error, nolog } = require('./src/log.js');
const { load } = require('./src/loader.js');
const { readdirSync } = require("fs")


intents = new IntentsBitField();
intents.add(IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.MessageContent);

var client = new Client({
    intents: intents
})

// Event Handler
readdirSync(`./src/events`).forEach(async file => {
	const event = await require(`./src/events/${file}`);
    info(`Loading Event: ${event.name}`);
	if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
	} else {
      client.on(event.name, (...args) => event.execute(...args));
	}
})

client.rest.on('rateLimited', (rateLimitInfo) => {
    warn(`Rate Limit has been exceeded. Timeout: ${rateLimitInfo.timeToReset}ms.`);
})

info('Loading Commands');
load(client);
info('Logging In');
client.login(config["discord-token"]);