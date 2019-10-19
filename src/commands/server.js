module.exports = {
	name: 'server',
	description: 'Displays server name and amount of members.',
	guildOnly: true,
	// aliases: [],
	usage: '!server',
	cooldown: 10,
	
	execute(message) {
		message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
	},
};