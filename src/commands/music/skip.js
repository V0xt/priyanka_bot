const { Command } = require('discord.js-commando');

module.exports = class SkipCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'skip',
      description: 'Skip the current playing song.',
      aliases: ['s'],
      group: 'music',
      memberName: 'skip',
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
      || message.guild.musicData.songDispatcher === null
    ) {
      message.reply('There is no song playing right now!');
      return;
    }
    message.guild.musicData.songDispatcher.end();
  }
};
