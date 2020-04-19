module.exports = {
	name: 'say',
	description: 'Makes the bot say something',
	guildOnly: false,
	// aliases: [],
	usage: '!say [something]',
	cooldown: 5,

	execute(message, args) {
		const sayMessage = args.join(' ');
		message.delete().catch(error=>{
			console.log(error);
		});
		message.channel.send(sayMessage);
	},
};