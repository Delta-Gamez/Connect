const { ActivityType } = require("discord.js")
const { info, warn } = require('../log.js');
const { register } = require('../loader.js');

module.exports = {
	name: 'ready',
	once: true,
	execute: async(client) => {
		const status1 = "Connect";
		const status2 = "DeltaGamez";
		const statustype = ActivityType.Listening;
		let activities = [status1, status2], i = 0;
		setInterval(() => client.user.setActivity({ name: `${activities[i++ % activities.length]}`, type: statustype }), 22000);

		info(`(RDY) Logged In as ${client.user.tag}`);
		info('Attempting: Register Commands in Guilds');
		await register(client);
		warn(`(NOTICE) Please allow up to 2 Minutes to prepare interactions. Commands sent without waiting will raise error 10062. Thank you for your patience.`);
}};
