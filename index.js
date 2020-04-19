require('dotenv').config();

const Discord = require('discord.js');
const Client = require('./client/Client');
const prefix = process.env.prefix;
const BOT_TOKEN = process.env.BOT_TOKEN;

const client = new Client();
client.commands = new Discord.Collection();

const recursiveDirReader = require('./src/utils/recursiveSearch.js');
const commandFiles = recursiveDirReader('./src/commands')
	.filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./src/commands/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

const logConnectionInfo = () => {
	console.log('Connected as ' + client.user.tag);

	console.log('Servers:');
	client.guilds.forEach((guild) => {
		console.log(' - ' + guild.name);
		guild.channels.forEach((channel) => {
			console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`);
		});
	});

	console.log('Ready!');
};

client.once('ready', () => {
	logConnectionInfo();

	client.user.setPresence({
		game: {
			name: 'with JavaScript',
			type: 'PLAYING',
		},
		status: 'online',
	});
});

client.once('reconnecting', () => {
	console.log('Reconnecting!');
});

client.once('disconnect', () => {
	console.log('Disconnect!');
});

const isCommand = (message, args) => {
	if (!message.content.startsWith(prefix) || message.author.bot) {
		return;
	}

	const commandName = args.shift().toLowerCase();
	return client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
};

const isGuildOnly = (command, message) => {
	return command.guildOnly && message.channel.type !== 'text';
};

client.on('message', async (message) => {
	const args = message.content.slice(prefix.length).split(/ +/);
	const command = isCommand(message, args);
	if (!command) return;

	if (isGuildOnly(command, message)) return message.reply('I can\'t execute that command inside DMs!');

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command.');
	}
});

client.login(BOT_TOKEN);