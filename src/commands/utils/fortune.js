const { Command } = require('discord.js-commando');
const fetch = require('node-fetch');

module.exports = class Fortune extends Command {
	constructor(client) {
		super(client, {
			name: 'fortune',
			description: 'Replies with a random fortune cookie quote.',
			group: 'utils',
			memberName: 'fortune',
			guildOnly: false,
			aliases: ['cookie'],
			usage: '!fortune',
			throttling: {
				usages: 2,
				duration: 10,
			},
		});
	}

	async run(message) {
		const fortunesLimit = 1;
		const fortunesToSkip = Math.floor(Math.random() * (540 - 1 + 1)) + 1;
		const result = await fetch(`http://fortunecookieapi.herokuapp.com/v1/fortunes?limit=${fortunesLimit}&skip=${fortunesToSkip}`).then(response => response.json());
		message.say(result[0].message);
	}
};