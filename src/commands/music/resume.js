const { Command } = require('discord.js-commando');

module.exports = class ResumeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'resume',
      description: 'Resume the current paused song.',
      aliases: ['resume-song', 'continue'],
      memberName: 'resume',
      group: 'music',
      guildOnly: true,
    });
  }

  run(message) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      message.reply('Join a channel and try again');
      return;
    }

    if (
      typeof message.guild.musicData.songDispatcher === 'undefined'
      || message.guild.musicData.songDispatcher === null
    ) {
      message.reply('There is no song playing right now!');
      return;
    }

    message.say('Song resumed :play_pause:');

    message.guild.musicData.songDispatcher.resume();
  }
};
