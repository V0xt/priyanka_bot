require('dotenv').config();
const { CommandoClient } = require('discord.js-commando');
const { Structures } = require('discord.js');
const path = require('path');
const fs = require('fs');

Structures.extend('Guild', Guild => {
	class MusicGuild extends Guild {
		constructor(client, data) {
			super(client, data);
			this.musicData = {
				queue: [],
				isPlaying: false,
				nowPlaying: null,
				volume: 1,
				songDispatcher: null,
			};
		}
	}
	return MusicGuild;
});

const client = new CommandoClient({
	commandPrefix: process.env.prefix,
	owner: '244140780967559169',
	unknownCommandResponse: false,
});

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['admin', 'Admin Commands'],
		['crypto', 'Crypto Commands'],
		['music', 'Music Commands'],
		['utils', 'Utility Commands'],
		// ['wolfram', 'Wolfram Command Group'],
	])
	.registerDefaultGroups()
	.registerDefaultCommands({
		eval: false,
	})
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
