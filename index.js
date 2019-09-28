const Discord = require('discord.js');
const fs = require('fs');
const Client = require('./client/Client');
const {
	prefix,
	token,
} = require('./config.json');

const client = new Client();
client.commands = new Discord.Collection();

const queue = new Map();

const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

console.log(client.commands);

client.once('ready', () => {
	console.log("Connected as " + client.user.tag);
	console.log("Servers:");
	client.guilds.forEach((guild) => {
		console.log(" - " + guild.name);
		guild.channels.forEach((channel) => {
			console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`);
		})
	});
	
	var generalChannel = client.channels.get("625350794949951491"); // Replace with known channel ID
	generalChannel.send("HeyGuys! :smiley_cat:  Type `!help` to get commands list."); 

	client.user.setActivity("with JavaScript");
	console.log('Ready!');
});

client.once('reconnecting', () => {
	console.log('Reconnecting!');
});

client.once('disconnect', () => {
	console.log('Disconnect!');
});

client.on('message', async (message) => {
	const args = message.content.slice(1).split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName);

	if (message.author.bot) {
		return;
	}
	if (!message.content.startsWith(prefix)) {
		return;
	}

	try {
		command.execute(message);
	} catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command!');
	}
});

client.login(token);