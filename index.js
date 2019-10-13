const Discord = require('discord.js');
const fs = require('fs');
const Client = require('./client/Client');
const {
	prefix,
	BOT_TOKEN,
} = require('./config.json');

const client = new Client();
client.commands = new Discord.Collection();


const commandFiles = fs.readdirSync('./src/commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./src/commands/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once('ready', () => {
	console.log('Connected as ' + client.user.tag);
	console.log('Servers:');
	client.guilds.forEach((guild) => {
		console.log(' - ' + guild.name);
		guild.channels.forEach((channel) => {
			console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`);
		})
	});

	console.log('Ready!');

	let generalChannel = client.channels.get('625350794949951491');
	generalChannel.send('HeyGuys! :smiley_cat:  Type `!help` to get commands list.'); 

	client.user.setActivity("with JavaScript");	
});

client.once('reconnecting', () => {
	console.log('Reconnecting!');
});

client.once('disconnect', () => {
	console.log('Disconnect!');
});

client.on('message', async (message) => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	
	const commandArgs = message.content.slice(1).split(/ +/);
	const commandName = commandArgs.shift().toLowerCase();
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;

	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

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
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, commandArgs);
	} catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command!');
	}
});

client.login(BOT_TOKEN);