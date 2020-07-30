const { Command } = require('discord.js-commando');
const fetch = require('node-fetch');

module.exports = class Meme extends Command {
	constructor(client) {
		super(client, {
			name: 'meme',
			description: 'Returns random meme template from imgflip.com',
			group: 'other',
			memberName: 'meme',
			guildOnly: false,
			// aliases: [ ],
			usage: '!meme',
			throttling: {
				usages: 2,
				duration: 10,
			},
		});
	}

	async run(message) {
		const result = await fetch('https://api.imgflip.com/get_memes').then(response => response.json());

		const rnd = Math.floor(Math.random() * 100) + 1;
		message.say(`${result.data.memes[rnd].url}`);
	}
};