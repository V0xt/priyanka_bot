module.exports = {
	name: 'server',
	description: 'Displays server info (id, name, region, members count).',
	guildOnly: true,
	// aliases: [],
	usage: '!server',
	cooldown: 10,

	execute(message) {
		console.log(message.guild);
		message.channel.send(`Server id: \`${message.guild.id}\`\nServer name: \`${message.guild.name}\`\nServer region: \`${message.guild.region}\`\nTotal members: \`${message.guild.memberCount}\``);
	},
};