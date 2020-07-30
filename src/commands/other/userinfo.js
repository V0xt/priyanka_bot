const { Command } = require('discord.js-commando');

module.exports = class UserInfo extends Command {
  constructor(client) {
    super(client, {
      name: 'userinfo',
      description: 'Display info about yourself.',
      group: 'other',
      memberName: 'userinfo',
      guildOnly: false,
      aliases: ['user-info', 'info'],
      throttling: {
        usages: 2,
        duration: 10,
      },
    });
  }

  run(message) {
    message.say(`
      Your username: ${message.author.username}
      Your ID: ${message.author.id}
    `.replace(/  +/g, ''));
  }
};