module.exports = {
	name: 'stop',
	description: 'Stop all songs in the queue!',
	guildOnly: true,
	// aliases: [],
	usage: '!stop',
	cooldown: 5,

	execute(message) {
		if(!message.member.roles.cache.find(role => role.name === 'Administrator')) {
			return message.channel.send('You don\'t have permissions to execute this command!');
		}

		const serverQueue = message.client.queue.get(message.guild.id);

		if (!message.member.voice.channel) {
			return message.channel.send('You have to be in a voice channel to stop the music!');
		}
		try {
			serverQueue.songs = [];
			serverQueue.connection.dispatcher.destroy();
		}
		catch(err) {
			console.log(err);
		}
	},
};