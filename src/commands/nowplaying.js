module.exports = {
	name: 'nowplaying',
	description: 'Get the song that is playing.',
	guildOnly: true,
	aliases: ['song'],
	usage: '!nowplaying',
	cooldown: 20,

	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) {
			return message.channel.send('There is nothing playing.');
		}
		return message.channel.send(`Now playing: ${serverQueue.songs[0].title}`);
	},
};