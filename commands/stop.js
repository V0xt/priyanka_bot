module.exports = {
	name: 'stop',
	usage: '!stop',
	description: 'Stop all songs in the queue!',
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!message.member.voiceChannel) {
			return message.channel.send('You have to be in a voice channel to stop the music!');
		}
		try {
			serverQueue.songs = [];
			serverQueue.connection.dispatcher.end();
		} catch(err) {
			console.log(err);
		}		
	},
};