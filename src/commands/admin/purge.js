const { Command } = require('discord.js-commando');

module.exports = class About extends Command {
  constructor(client) {
    super(client, {
      name: 'purge',
      description: 'Removes all messages from all users in the channel, up to 100.',
      group: 'admin',
      memberName: 'purge',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 10,
      },
    });
  }

  run(message, args) {
    const amount = parseInt(args[0]) + 1;

    if (isNaN(amount)) {
      return message.reply('That doesn\'t seem to be a valid number.');
    }
    if (amount <= 1 || amount > 100) {
      return message.reply('You need to input a number between 1 and 99.');
    }

    message.channel.bulkDelete(amount).catch(err => {
      console.error(err);
      message.say('there was an error trying to delete messages in this channel!');
    });
  }
};
