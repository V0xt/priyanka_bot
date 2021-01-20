const { Command } = require('discord.js-commando');

module.exports = class SayCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'say',
      description: 'Makes me say something.',
      group: 'other',
      memberName: 'say',
      guildOnly: true,
      aliases: ['parrot', 'copy'],
      examples: [
        '`!say Oh, hi Mark!`',
      ],
      throttling: {
        usages: 2,
        duration: 10,
      },
      args: [
        {
          key: 'text',
          prompt: 'What would you like me to say?',
          type: 'string',
          validate: (text) => text.length < 201,
        },
      ],
    });
  }

  run(message, { text }) {
    message.reply(text);
  }
};
