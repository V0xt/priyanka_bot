const { Command } = require('discord.js-commando');

module.exports = class ServerInfo extends Command {
  constructor(client) {
    super(client, {
      name: 'server',
      description: 'Displays server info (id, name, region, members count).',
      group: 'other',
      memberName: 'server',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 10,
      },
    });
  }

  run(message) {
    message.say(`
      Server id: \`${message.guild.id}\`
      Server name: \`${message.guild.name}\`
      Server region: \`${message.guild.region}\`
      Total members: \`${message.guild.memberCount}\`
    `.replace(/  +/g, ''));
  }
};