const Discord = require('discord.js');
const prefix = process.env.prefix;
const cooldowns = new Discord.Collection();

const isCommand = (message, args, client) => {
	if (!message.content.startsWith(prefix)) {
		return;
	}

	const commandName = args.shift().toLowerCase();
	return client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
};

const isGuildOnly = (command, message) => {
	return command.guildOnly && message.channel.type !== 'text';
};

module.exports = (client, message) => {
	if(message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = isCommand(message, args, client);
	if (!command) return;

	if (isGuildOnly(command, message)) return message.reply('I can\'t execute that command inside DMs.');

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
};