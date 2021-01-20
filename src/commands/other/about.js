const { Command } = require('discord.js-commando');

module.exports = class About extends Command {
  constructor(client) {
    super(client, {
      name: 'about',
      description: 'Display info about me.',
      group: 'other',
      memberName: 'about',
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 10,
      },
    });
  }

  run(message) {
    message.say('Follow the link to get more info about the bot https://github.com/v0xat/priyanka_bot/');
  }
};
