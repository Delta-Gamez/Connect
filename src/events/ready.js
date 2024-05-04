const { ActivityType } = require("discord.js")
const { info, warn } = require('../log.js');
const { register } = require('../loader.js');
const { statues, statustypes } = require('../../config.json');

module.exports = {
	name: 'ready',
	once: true,
	execute: async(client) => {
		if(!statues) return;
		if(!statustypes) return;

		let statustype;

		switch (statustypes) {
			case 'PLAYING':
				statustype = 'PLAYING';
				break;
			case 'WATCHING':
				statustype = 'WATCHING';
				break;
			case 'STREAMING':
				statustype = 'STREAMING';
				break;
			case 'LISTENING':
				statustype = 'LISTENING';
				break;
			case 'COMPETING':
				statustype = 'COMPETING';
				break;
		}

		let activities = statues, i = 0;
		setInterval(() => client.user.setActivity({ name: `${activities[i++ % activities.length]}`, type: statustype }), 22000);

		info(`(RDY) Logged In as ${client.user.tag}`);
		info('Attempting: Register Commands in Guilds');
		await register(client);
		warn(`(NOTICE) Please allow up to 2 Minutes to prepare interactions. Commands sent without waiting will raise error 10062. Thank you for your patience.`);
}};
