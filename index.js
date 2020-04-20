require('dotenv').config();

const Discord = require('discord.js');
const Client = require('./client/Client');
const fs = require('fs');
const recursiveDirReader = require('./src/utils/recursiveSearch.js');

const client = new Client();
client.commands = new Discord.Collection();

fs.readdir('./src/events/', (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		const event = require(`./src/events/${file}`);
		const eventName = file.split('.')[0];
		client.on(eventName, event.bind(null, client));
	});
});

recursiveDirReader('./src/commands')
	.filter((file) => file.endsWith('.js'))
	.forEach(file => {
		const command = require(`./src/commands/${file}`);
		client.commands.set(command.name, command);
	});

client.login(process.env.BOT_TOKEN);