const fs = require('fs');

module.exports = {
	name: 'help',
	usage: '!help',
	description: 'List all available commands with brief description.',
	execute(message) {
		let str = '';
		
		const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
		
		for (const file of commandFiles) {
			const command = require(`./${file}`);
			str += `\`${command.usage}\` - ${command.description} \n`;
		}
		message.channel.send(str + `You can also try \`!info\` to get more about the bot.`);
	},
};
