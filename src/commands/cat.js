const fetch = require('node-fetch');

module.exports = {
	name: 'cat',
	description: 'Returns random cat picture from aws.random.cat',
	guildOnly: false,
	//aliases: [],
	usage: '!cat',
	cooldown: 6,	

	async execute(message) {
		const { file }  = await fetch('https://aws.random.cat/meow').then(response => response.json());
		message.channel.send(file);		
	},
};

