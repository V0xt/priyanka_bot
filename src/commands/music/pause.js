const { Command } = require('discord.js-commando');

module.exports = class PauseCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'pause',
      description: 'Pause the current playing song.',
      aliases: ['hold'],
      memberName: 'pause',
      group: 'music',
      guildOnly: true,
    });
  }

  run(message) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      message.reply('Join a voice channel and try again');
      return;
    }

    if (
      typeof message.guild.musicData.songDispatcher === 'undefined'
      || message.guild.musicData.songDispatcher == null
    ) {
      message.say('There is no song playing right now!');
      return;
    }

    message.say('Song paused :pause_button:');

    message.guild.musicData.songDispatcher.pause();
  }
};
