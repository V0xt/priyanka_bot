module.exports = {
	name: 'say',
	description: 'Makes the bot say something',
	guildOnly: true,
	// aliases: [],
	usage: '!say [something]',
	cooldown: 5,

	execute(message, args) {
		if (!args.length) {
			return message.channel.send('Say what?');
		}

		const sayMessage = args.join(' ');
		message.delete().catch(error=>{
			console.log(error);
		});
		return message.channel.send(sayMessage);
	},
};