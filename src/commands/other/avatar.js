const { Command } = require('discord.js-commando');

module.exports = class Avatar extends Command {
  constructor(client) {
    super(client, {
      name: 'avatar',
      description: 'Get the avatar URL of the tagged user(s), or your own avatar.',
      group: 'other',
      memberName: 'avatar',
      guildOnly: false,
      aliases: ['icon', 'pfp'],
      examples: [
        '!avatar @Priyanka, @Bob',
      ],
      throttling: {
        usages: 2,
        duration: 10,
      },
    });
  }

  run(message) {
    if (!message.mentions.users.size) {
      return message.say(`Your avatar: <${message.author.displayAvatarURL()}>`);
    }

    const avatarList = message.mentions.users.map(user => {
      return `${user.username}'s avatar: <${user.displayAvatarURL()}>`;
    });

    message.say(avatarList);
  }
};
