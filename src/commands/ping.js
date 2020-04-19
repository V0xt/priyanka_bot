module.exports = {
	name: 'ping',
	description: 'Returns \'Pong!\'',
	guildOnly: false,
	// aliases: [],
	usage: '!ping',
	cooldown: 5,

	async execute(message) {
		const msg = await message.channel.send('Ping?');
		msg.edit(`Pong! Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(message.client.ping)}ms`);
	},
};