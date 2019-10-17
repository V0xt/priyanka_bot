const fetch = require('node-fetch');

module.exports = {
	name: 'fortune',
	description: 'Replies with a random fortune cookie quote.',
	guildOnly: false,
	aliases: ['cookie'],
	usage: '!fortune',
	cooldown: 86400,
	
	async execute (message) {
		let fortunesLimit = 1;
		let fortunesToSkip = Math.floor(Math.random() * (540 - 1 + 1)) + 1;
		const result  = await fetch(`http://fortunecookieapi.herokuapp.com/v1/fortunes?limit=${fortunesLimit}&skip=${fortunesToSkip}`).then(response => response.json());
		message.channel.send(result[0].message);
	},
};