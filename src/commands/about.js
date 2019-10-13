module.exports = {
	name: 'about',
	description: 'Display info about this bot.',
	// aliases: [],
	usage: '!about',
	cooldown: 15,
	
	execute(message) {
		message.channel.send('Follow the link to get more info about the bot https://github.com/V0xt/priyanka_bot');
	},
};