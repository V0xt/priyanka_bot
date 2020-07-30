const { Command } = require('discord.js-commando');

module.exports = class ServerInfo extends Command {
	constructor(client) {
		super(client, {
			name: 'server',
			description: 'Displays server info (id, name, region, members count).',
			group: 'other',
			memberName: 'server',
			guildOnly: true,
			// aliases: [],
			usage: '!server',
			throttling: {
				usages: 2,
				duration: 10,
			},
		});
	}

	run(message) {
		message.say(`Server id: \`${message.guild.id}\`\nServer name: \`${message.guild.name}\`\nServer region: \`${message.guild.region}\`\nTotal members: \`${message.guild.memberCount}\``);
	}
};