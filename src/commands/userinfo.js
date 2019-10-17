module.exports = {
	name: 'userinfo',
	description: 'Display info about yourself.',
	guildOnly: false,
	aliases: ['user-info', 'info'],
	usage: '!userinfo',
	cooldown: 5,	
	
	execute(message) {
		message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
	},
};