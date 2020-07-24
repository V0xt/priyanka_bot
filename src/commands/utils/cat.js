const { Command } = require('discord.js-commando');
const fetch = require('node-fetch');

module.exports = class Cat extends Command {
	constructor(client) {
		super(client, {
			name: 'cat',
			description: 'Returns random cat picture from aws.random.cat',
			group: 'utils',
			memberName: 'cat',
			guildOnly: false,
			// aliases: [],
			usage: '!cat',
			throttling: {
				usages: 2,
				duration: 10,
			},
		});
	}

	async run(message) {
		const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());
		message.say(file);
	}
};

