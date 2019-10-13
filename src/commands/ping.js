module.exports = {
	name: 'ping',
	description: 'Returns \'Pong!\'',
	guildOnly: false,
	// aliases: [],
	usage: '!ping',
	cooldown: 20,
	
	execute(message) {
		message.channel.send('Pong!');
	},
};