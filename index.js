const { Client, IntentsBitField } = require("discord.js");
const { info, warn, success } = require("./src/log.js");
const { load, register } = require("./src/loader.js");
const { readdirSync } = require("fs");

success("Connect is now starting.");

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

load(client).then(() => {
    client.login(process.env.DISCORD_TOKEN).then(() => {
        register(client);
    });
});
success("Connect has now Started.");