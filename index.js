const { Client, IntentsBitField } = require("discord.js");
const { info, warn, custom } = require("./src/log.js");
const { load } = require("./src/loader.js");
const { readdirSync } = require("fs");

custom(`[Starting]`, `Connect is now Starting.`);

intents = new IntentsBitField();
intents.add(
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.MessageContent,
);

var client = new Client({
    intents: intents,
});

// Event Handler
(async () => {
    const eventFiles = readdirSync("./src/events");
    const eventNames = [];

    for (const file of eventFiles) {
        const event = require(`./src/events/${file}`);
        eventNames.push(` ${event.name}`);

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }

    info(`Loaded Events: ${eventNames}`);
})();

client.rest.on("rateLimited", (rateLimitInfo) => {
    warn(
        `Rate Limit has been exceeded. Timeout: ${rateLimitInfo.timeToReset}ms.`,
    );
});

load(client);
client.login(process.env.DISCORD_TOKEN);
custom(`[Started]`, `Connect is now online.`);
