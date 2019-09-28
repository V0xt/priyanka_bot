module.exports = {
	name: 'ping',
	usage: '!ping',
	description: 'Returns \'Pong!\'',
	execute(message) {
		message.channel.send('Pong!');
	},
};