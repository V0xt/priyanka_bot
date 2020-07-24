require('dotenv').config();
const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const fs = require('fs');

const client = new CommandoClient({
	commandPrefix: '!',
	owner: '244140780967559169',
});

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['admin', 'Admin Command Group'],
		['crypto', 'Crypto Command Group'],
		['music', 'Music Command Group'],
		['utils', 'Utility Command Group'],
		// ['wolfram', 'Wolfram Command Group'],
	])
	.registerDefaultGroups()
	.registerDefaultCommands()
	.registerCommandsIn(path.join(__dirname, 'src/commands'));

fs.readdir('./src/events/', (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		const event = require(`./src/events/${file}`);
		const eventName = file.split('.')[0];
		client.on(eventName, event.bind(null, client));
	});
});

client.login(process.env.BOT_TOKEN);
