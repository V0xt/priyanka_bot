const { Command } = require('discord.js-commando');

module.exports = class PauseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pause',
			description: 'Pause the current playing song.',
			aliases: ['pause-song', 'hold', 'stop'],
			memberName: 'pause',
			group: 'music',
			guildOnly: true,
			usage: '!pause',
		});
	}

	run(message) {
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) return message.reply('Join a voice channel and try again');

		if (
			typeof message.guild.musicData.songDispatcher == 'undefined' ||
			message.guild.musicData.songDispatcher == null
		) {
			return message.say('There is no song playing right now!');
		}

		message.say('Song paused :pause_button:');

		message.guild.musicData.songDispatcher.pause();
	}
};