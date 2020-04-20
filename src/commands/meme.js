const fetch = require('node-fetch');

module.exports = {
	name: 'meme',
	description: 'Returns random meme template from imgflip.com',
	guildOnly: false,
	// aliases: [ ],
	usage: '!meme',
	cooldown: 10,

	async execute(message) {
		const result = await fetch('https://api.imgflip.com/get_memes').then(response => response.json());

		const rnd = Math.floor(Math.random() * 100) + 1;
		message.channel.send(`${result.data.memes[rnd].url}`);
	},
};