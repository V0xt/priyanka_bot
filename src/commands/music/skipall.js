/* eslint-disable no-param-reassign */
const { Command } = require('discord.js-commando');

module.exports = class SkipAllCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'skipall',
      description: 'Skip all songs in queue.',
      aliases: ['sa'],
      memberName: 'skipall',
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
      || message.guild.musicData.songDispatcher === null
    ) {
      message.reply('There is no song playing right now!');
      return;
    }
    if (!message.guild.musicData.queue) {
      message.say('There are no songs in queue');
      return;
    }

    message.guild.musicData.songDispatcher.end();
    message.guild.musicData.queue.length = 0;
  }
};
