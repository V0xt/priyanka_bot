module.exports = {
	name: 'info',
	usage: '!info',
	description: 'Info command.',
	execute(message) {
		message.channel.send('Type `!help` to get full list of available commands\n' + 
			'Follow the link to get more info about the bot https://github.com/V0xt/priyanka_bot');
	},
};